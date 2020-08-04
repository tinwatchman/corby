const AbstractTagger = require("./abstract-tagger.js");

class AllCharTypesTagger extends AbstractTagger {

	constructor() {
		super();
		this.name = "all-char-types";
	}

	match(str) {
		const ptns = [
			/\d/gi,
			/[A-Z]/g,
			/[a-z]/g,
			/[!@#$%^&*()?+,.{}/:;<>=_~'"`\|\\\-\[\]]/gi
		];
		return ptns.every((ptn) => {
			return ptn.test(str);
		});
	}

}

module.exports = AllCharTypesTagger;