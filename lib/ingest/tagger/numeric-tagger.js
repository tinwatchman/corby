const AbstractTagger = require("./abstract-tagger.js");

class NumericTagger extends AbstractTagger {

	constructor() {
		super();
		this.name = "numeric";
	}

	match(str) {
		const ptn = /[^\d]/gi;
		return !(ptn.test(str));
	}

}

module.exports = NumericTagger;