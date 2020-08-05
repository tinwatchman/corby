const chai = require('chai');
const expect = require('chai').expect;
const VerboseSettings = require("../lib/console-verbose.js");

describe('VerboseSettings', function() {
	it('should hide this', function() {
		console.verbose("you shouldn't see this");
	});
	it('should show this', function() {
		VerboseSettings.setVerbose(true);
		console.verbose("you should see this");
	});
	it('should also show this', function() {
		console.verbose('you should also see this');
	});
	it('but not this', function() {
		VerboseSettings.setVerbose(false);
		console.verbose('but not this');
	});
});