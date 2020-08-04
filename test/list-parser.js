'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const WordlistParser = require("../lib/ingest/parser/list-parser.js");

describe('WordlistParser', function() {

	it('should just return the input string', function() {
		const parser = new WordlistParser();
		let r = parser.parse("toor");
		expect(r).to.equal("toor");
	});

	it('should remove unneeded whitespace', function() {
		const parser = new WordlistParser();
		let r = parser.parse(" toor  ");
		expect(r).to.equal("toor");
	});

});