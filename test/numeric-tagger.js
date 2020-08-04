const chai = require('chai');
const expect = require('chai').expect;
const NumericTagger = require("../lib/ingest/tagger/numeric-tagger.js");

describe("NumericTagger", function() {

	it("should match strings that consist only of digits", function() {
		let n = new NumericTagger();
		expect(n.match("101231249")).to.equal(true);
	});

	it("should not match strings containing any other characters", function() {
		let n = new NumericTagger();
		expect(n.match("abc123")).to.equal(false);
		expect(n.match("123 456")).to.equal(false);
		expect(n.match("1qaz2wsx")).to.equal(false);
	});
	
});