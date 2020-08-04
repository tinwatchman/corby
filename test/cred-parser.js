'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const CredentialParser = require("../lib/ingest/parser/cred-parser.js");

describe('CredentialParser', function() {

	it('should split a credential pair', function() {
		const parser = new CredentialParser();
		let r = parser.parse("secure:SecurityMaster08");
		expect(r).to.equal("SecurityMaster08");
	});

	it('should return null when the password is blank', function() {
		const parser = new CredentialParser();
		let r = parser.parse("root:");
		expect(r).to.be.null;
	});

});