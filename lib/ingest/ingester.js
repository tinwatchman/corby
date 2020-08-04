const fs = require('fs');
const path = require('path');
const Database = require("../model/db.js");
const TextReader = require("./reader/text-reader.js");
const WordlistParser = require("./parser/list-parser.js");
const CredentialParser = require("./parser/cred-parser.js");
const NumericTagger = require("./tagger/numeric-tagger.js");
const AllCharTypesTagger = require("./tagger/all-char-types-tagger.js");

const SourceFile = require("../model/file.js");

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
			let file = new SourceFile();
			file.name = data.fileName;
			file.path = data.filePath;
			file.type = options.fileType;
			file.format = options.format;
			file.created = new Date();
			file.updated = new Date();
			return this.getOrAddFile(file);
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

	getOrAddFile(fileName, db) {
		return new Promise((resolve, reject) => {
			let file = null;
			db.getFile(fileName).then((f) => {
				file = f;
				if (file !== null) {
					resolve(file);
					return Promise.resolve(false);
				}
				return db.addFile(file);
			}).then((added) => {
				if (added === file) {
					resolve(file);
				}
			}).catch((err) => {
				reject(err);
			});
		});
	}

	addNewWord(word, file, db) {
		return new Promise((resolve, reject) => {
			db.addWord(word).then(() => {
				// add file association
				return db.addFileWord(file, word);
			}).then(() => {
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