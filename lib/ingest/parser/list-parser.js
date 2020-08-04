'use strict';

const AbstractParser = require("./abstract-parser.js");

class WordlistParser extends AbstractParser {

	parse(str) {
		return str.trim();
	}

}

module.exports = WordlistParser;