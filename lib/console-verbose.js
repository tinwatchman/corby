let _isVerboseEnabled = false;

class VerboseSettings {

	static getVerbose() {
		return _isVerboseEnabled;
	}

	static setVerbose(val) {
		_isVerboseEnabled = val;
	}
}

console.verbose = function(str) {
	if (VerboseSettings.getVerbose() && arguments.length > 1) {
		console.log.apply(console, arguments);
	} else if (VerboseSettings.getVerbose()) {
		console.log(str);
	}
}

module.exports = VerboseSettings;