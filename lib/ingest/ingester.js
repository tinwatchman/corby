const fs = require('fs');
const path = require('path');
const Database = require("../model/db.js");
const TextReader = require("./reader/text-reader.js");
const WordlistParser = require("./parser/list-parser.js");
const CredentialParser = require("./parser/cred-parser.js");
const NumericTagger = require("./tagger/numeric-tagger.js");
const AllCharTypesTagger = require("./tagger/all-char-types-tagger.js");

const SourceFile = require("../model/file.js");
const Word = require("../model/word.js");

require("../console-verbose.js");

class FileIngester {

	ingest(options) {
		let db = new Database();
		let data = {};
		// step 1: copy file to source folder
		this.copy(options.filePath).then((copied) => {
			data.filePath = copied.copyPath;
			if (!options['fileName']) {
				data.fileName = copied.fileName;
			} else {
				data.fileName = options.fileName;
			}
			return this.process({
				filePath: data.filePath,
				fileType: options.fileType,
				format: options.format,
			});
		}).then((words) => {
			data.words = words;
			// start up db
			return db.connect();
		}).then(() => {
			return this.getAutoTags(db);
		}).then((autoTags) => {
			data.autoTags = autoTags;
			// insert file
			return this.addNewFile({
				fileName: data.fileName,
				filePath: data.filePath,
				fileType: options.fileType,
				format: options.format,
			}, db);
		}).then((file) => {
			data.file = file;
			// add or update words
			let wordPromises = [];
			data.words.forEach((wordObj) => {
				wordPromises.push(
					this.addOrUpdateWord(
						wordObj,
						file,
						data.autoTags,
						db
					)
				);
			});
			console.verbose("adding or updating %d words", wordPromises.length);
			return Promise.all(wordPromises);
		}).then(() => {
			// close database
			return db.close();
		}).then(() => {
			console.verbose("... file %s ingest complete", data.file.name);
		}).catch((err) => {
			console.log("INGEST ERROR");
			console.log(err);
			console.log("%j", err);
		});
	}

	copy(filePath) {
		return new Promise((resolve, reject) => {
			const parsed = path.parse(filePath);
			const savePath = path.resolve(__dirname, '../../sources', parsed.base);
			console.verbose('Copying %s to %s...', filePath, savePath);
			fs.copyFile(filePath, savePath, (err) => {
				if (err) {
					reject(err);
				} else {
					console.verbose('... done');
					resolve({
						copyPath: savePath,
						fileName: parsed.base,
						fileExt: parsed.ext
					});
				}
			});
		});
	}

	process(options) {
		return new Promise((resolve, reject) => {
			//todo: support files other than  text
			let reader = new TextReader();
			reader.path = options.filePath;
			// set parser
			if (options.format === 'credentials') {
				reader.parser = new CredentialParser();
			} else {
				reader.parser = new WordlistParser();
			}
			// add taggers
			reader.taggers.push(new NumericTagger());
			reader.taggers.push(new AllCharTypesTagger());
			// do the work
			reader.read().then((words) => {
				resolve(words);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	getAutoTags(db) {
		return new Promise((resolve, reject) => {
			db.getTagsByType("auto").then((tags) => {
				// return tags indexed by name
				let dict = {};
				tags.forEach((t) => {
					dict[t.tag] = t;
				});
				resolve(dict);
			}).catch((err) => {
				reject(err);
			});
		});
	}


	addNewFile(fileObj, db) {
		// create SourceFile object
		let file = new SourceFile();
		file.name = fileObj.fileName;
		file.path = fileObj.filePath;
		//todo: add url if included
		file.type = fileObj.fileType;
		file.format = fileObj.format;
		file.created = new Date();
		file.updated = new Date();
		// add to database
		return db.addFile(file);
	}

	addOrUpdateWord(wordObj, file, autoTags, db) {
		return new Promise((resolve, reject) => {
			db.getWord(wordObj.word).then((word) => {
				if (word !== null) {
					// if word needs to be updated
					return this.updateWord({
						word: word,
						wordObj: wordObj,
						file: file,
						autoTags: autoTags,
						db: db
					});
				} else {
					return this.addNewWord({
						wordObj: wordObj,
						file: file,
						autoTags: autoTags,
						db: db
					});
				}
			}).then(() => {
				resolve();
			}).catch((err) => {
				reject(err);
			});
		});
	}

	updateWord(args) {
		// unpack args
		let word = args.word;
		const file = args.file;
		const wordObj = args.wordObj;
		const autoTags = args.autoTags;
		const db = args.db;
		// figure out what needs updating
		let promises = [];
		if (!word.hasFile(file.name)) {
			console.verbose("update: adding word %s to file %s", word.word, file.name);
			promises.push(
				db.addFileWord(file, word)
			);
		}
		wordObj.tags.forEach((tagName) => {
			if (!word.hasTag(tagName) && autoTags[tagName]) {
				console.verbose("update: adding tag %s to word %s", tagName, word.word);
				promises.push(
					db.addWordTag(word, autoTags[tagName])
				);
			}
		});
		// return promises as a whole
		return Promise.all(promises);
	}

	addNewWord(args) {
		return new Promise((resolve, reject) => {
			// unpack
			const wordObj = args.wordObj;
			const file = args.file;
			const autoTags = args.autoTags;
			const db = args.db;
			// create word
			let word = new Word();
			word.word = wordObj.word;
			word.length = wordObj.length;
			word.strength = wordObj.strength;
			word.created = new Date();
			word.updated = new Date();
			wordObj.tags.forEach((tagName) => {
				if (autoTags[tagName]) {
					word.tags.push(autoTags[tagName]);
				}
			});	
			// add to database
			db.addWord(word).then((w) => {
				// add file association
				console.verbose("add: word %s assigned id %d", w.word, word.id);
				return db.addFileWord(file, w);
			}).then(() => {
				console.verbose("add: word id %d (%s) assigned to file", word.id, word.word);
				if (word.tags.length === 0) {
					return Promise.resolve();
				}
				let promises = word.tags.map((tag) => {
					return db.addWordTag(word, tag);
				});
				return Promise.all(promises);
			}).then(() => {
				resolve(word);
			}).catch((err) => {
				reject(err);
			});
		});
	}

}

module.exports = FileIngester;