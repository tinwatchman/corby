'use strict';

const AbstractParser = require("./abstract-parser.js");

/**
 * Parses username:password credential pairs, such as those found in
 * `windows-betterdefaultpasslist.txt`.
 */
class CredentialParser extends AbstractParser {

	parse(str) {
		let pair = str.trim().split(':');
		if (pair.length < 2 || pair[1].length === 0) {
			return null;
		} else if (pair.length > 2) {
			// TODO: if the credentials contain more than one colon somehow
		}
		return pair[1].trim();
	}

}

module.exports = CredentialParser;