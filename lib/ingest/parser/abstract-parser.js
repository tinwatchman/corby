'use strict';

class AbstractParser {

	parse(str) {
		throw new Error('Must override abstract method in subclass');
	}

}

module.exports = AbstractParser;