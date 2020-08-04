const FileIngester = require("./ingest/ingester.js");
const VerboseSettings = require("./console-verbose.js");

module.exports = function(options) {
	// set verbose mode
	VerboseSettings.setVerbose(options.verbose);
	// run ingest
	let ingester = new FileIngester();
	ingester.ingest(options);
};