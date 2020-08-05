/* SQLite database create script - just to give some idea of what that looks like at present */
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "files" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name"	TEXT NOT NULL,
	"path"	TEXT NOT NULL,
	"url"	TEXT DEFAULT NULL,
	"type"	TEXT,
	"format"	TEXT,
	"created"	TEXT,
	"updated"	TEXT
);
CREATE TABLE IF NOT EXISTS "tags" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"tag"	TEXT NOT NULL,
	"type"	TEXT,
	"created"	TEXT,
	"updated"	TEXT
);
CREATE TABLE IF NOT EXISTS "words" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"word"	TEXT NOT NULL,
	"length"	INTEGER,
	"strength"	INTEGER,
	"origin_id"	INTEGER DEFAULT NULL,
	"created"	BLOB,
	"updated"	BLOB
);
CREATE TABLE IF NOT EXISTS "file_words" (
	"file_id"	INTEGER,
	"word_id"	INTEGER,
	"line"	INTEGER DEFAULT NULL,
	"index"	INTEGER DEFAULT NULL,
	"created"	TEXT,
	"updated"	TEXT,
	FOREIGN KEY("word_id") REFERENCES "words"("id"),
	FOREIGN KEY("file_id") REFERENCES "files"("id")
);
CREATE TABLE IF NOT EXISTS "word_tags" (
	"word_id"	INTEGER,
	"tag_id"	INTEGER,
	"created"	TEXT,
	FOREIGN KEY("word_id") REFERENCES "words"("id"),
	FOREIGN KEY("tag_id") REFERENCES "tags"("id")
);
COMMIT;