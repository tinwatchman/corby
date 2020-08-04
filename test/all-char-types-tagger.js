const chai = require('chai');
const expect = require('chai').expect;
const AllCharTypesTagger = require("../lib/ingest/tagger/all-char-types-tagger.js");

describe("AllCharTypesTagger", function() {

	it("should match strings consisting of at least one uppercase, one lowercase, one digit, and one special character", function() {
		let n = new AllCharTypesTagger();
		expect(n.match("T,[f2Tvec_FrD/#.")).to.equal(true);
	});

	it("should not match strings not meeting the above criteria", function() {
		let n = new AllCharTypesTagger();
		expect(n.match("abc123")).to.equal(false);
		expect(n.match("123 456")).to.equal(false);
		expect(n.match("1qaz2wsx")).to.equal(false);
		expect(n.match("dh2dXY34TZpqg5Kh")).to.equal(false);
		expect(n.match("r,`CY>w%")).to.equal(false);
		expect(n.match("WN;Y327(")).to.equal(false);
		expect(n.match("7ap!>d37")).to.equal(false);
	});
	
});