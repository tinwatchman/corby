const AbstractParser = require("../parser/abstract-parser.js");

class AbstractReader {

	constructor() {
		this._path = null;
		this._stream = null;
		this._parser = null;
		this._taggers = [];
	}

	get parser() {
		return this._parser;
	}

	set parser(parser) {
		if (!(parser instanceof AbstractParser)) {
			throw new Error("Parser must extend AbstractParser class");
		}
		this._parser = parser;
	}

	get path() {
		return this._path;
	}

	set path(val) {
		this._path = val;
	}

	get stream() {
		return this._stream;
	}

	set stream(stream) {
		this._stream = stream;
	}

	get taggers() {
		return this._taggers;
	}

	read() {
		throw new Error("Must override abstract method in subclass");
	}

}

module.exports = AbstractReader;