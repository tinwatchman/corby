const path = require('path');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const SourceFile = require("./file.js");
const Tag = require("./tag.js");
const Word = require("./word.js");


class Database {

	constructor() {
		this._db = null;
		this._isConnected = false;
	}

	connect() {
		return new Promise((resolve, reject) => {
			const dbPath = path.resolve(__dirname, "../../db/corby.db");
			sqlite.open({
				filename: dbPath,
				driver: sqlite3.Database
			}).then((db) => {
				if (db) {
					this._db = db;
					this._isConnected = true;
					resolve();
				} else {
					reject(db);
				}
			}).catch((err) => {
				reject(err);
			});
		});
	}

	// GETS

	getWord(word) {
		return new Promise((resolve, reject) => {
			this._db.get(
				"SELECT * FROM words WHERE word = ?",
				word
			).then((row) => {
				if (!row) {
					resolve(null);
					return;
				}
				let word = Word.fromRow(row);
				this.getWordFiles(word.id).then((files) => {
					word.files = files;
					return this.getWordTags(word.id);
				}).then((tags) => {
					word.tags = tags;
					resolve(word);
				}).catch((err) => {
					reject(err);
				});
			}).catch((err) => {
				reject(err);
			});
		});
	}

	getTag(str) {
		return new Promise((resolve, reject) => {
			this._db.get(
				"SELECT * FROM tags WHERE tag = ?",
				str
			).then((row) => {
				if (!row) {
					resolve(null);
					return;
				}
				resolve(Tag.fromRow(row));
			}).catch((err) => {
				reject(err);
			});
		});
	}

	getFile(name) {
		return new Promise((resolve, reject) => {
			this._db.get(
				"SELECT * FROM files WHERE name = ?",
				name
			).then((row) => {
				if (!row) {
					resolve(null);
					return;
				}
				resolve(SourceFile.fromRow(row));
			}).catch((err) => {
				reject(err);
			});
		});
	}

	getTagsByType(tagType) {
		return new Promise((resolve, reject) => {
			this._db.all(
				"SELECT * FROM tags WHERE type = ?",
				tagType
			).then((rows) => {
				if (!rows || rows.length === 0) {
					resolve(null);
					return;
				}
				let tags = rows.map((row) => {
					return Tag.fromRow(row);
				});
				resolve(tags);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	getWordFiles(wordId) {
		return new Promise((resolve, reject) => {
			this._db.all(
				"SELECT * FROM file_words " +
				"LEFT JOIN files ON files.id = file_words.file_id " +
				"WHERE word_id = ?",
				wordId
			).then((rows) => {
				if (rows.length === 0) {
					resolve([]);
				} else {
					let files = rows.map((row) => {
						return SourceFile.fromRow(row);
					});
					resolve(files);
				}
			}).catch((err) => {
				reject(err);
			});
		});
	}

	getWordTags(wordId) {
		return new Promise((resolve, reject) => {
			this._db.all(
				"SELECT * FROM word_tags " +
				"LEFT JOIN tags ON tags.id = word_tags.tag_id " +
				"WHERE word_id = ?",
				wordId
			).then((rows) => {
				if (rows.length === 0) {
					resolve([]);
				} else {
					let tags = rows.map((row) => {
						return Tag.fromRow(row);
					});
					resolve(tags);
				}
			}).catch((err) => {
				reject(err);
			});
		});
	}

	// ADDS

	addFile(file) {
		return new Promise((resolve, reject) => {
			if (!SourceFile.validate(file)) {
				throw new Error("invalid input");
			}
			this._db.run(
				"INSERT INTO files (name, path, url, type, format, created, updated) " +
				"VALUES (:name, :path, :url, :type, :format, :created, :updated)",
				{
					name: file.name,
					path: file.path,
					url: file.url,
					type: file.type,
					format: file.format,
					created: file.created.toISOString(),
					updated: file.updated.toISOString()
				}
			).then((result) => {
				file.id = result.lastID;
				resolve(file);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	addTag(tag) {
		//TODO
	}

	addWord(word) {
		return new Promise((resolve, reject) => {
			if (!Word.validate(word)) {
				throw new Error("invalid input");
			}
			this._db.run(
				"INSERT INTO words (word, length, strength, created, updated) " +
				"VALUES (:word, :len, :str, :created, :updated)",
				{
					word: word.word,
					len: word.length,
					str: word.strength,
					created: word.created.toISOString(),
					updated: word.updated.toISOString()
				}
			).then((result) => {
				word.id = result.lastID;
				resolve(word);	
			}).catch((err) => {
				reject(err);
			});
		});
	}

	addWordTag(word, tag) {
		return new Promise((resolve, reject) => {
			this._db.run(
				"INSERT INTO word_tags (word_id, tag_id, created) " +
				"VALUES (:wordId, :tagId, :created)",
				{
					wordId: word.id,
					tagId: tag.id,
					created: new Date().toISOString()
				}
			).then((result) => {
				resolve();
			}).catch((err) => {
				reject(err);
			});
		});
	}

	addFileWord(file, word) {
		return new Promise((resolve, reject) => {
			this._db.run(
				"INSERT INTO file_words (file_id, word_id, created, updated) " +
				"VALUES (:fileId, :wordId, :created, :updated)",
				{
					fileId: file.id,
					wordId: word.id,
					created: new Date().toISOString(),
					updated: new Date().toISOString()
				}
			).then((result) => {
				resolve();
			}).catch((err) => {
				reject(err);
			});
		});
	}
}

module.exports = Database;