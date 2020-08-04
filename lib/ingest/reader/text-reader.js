const fs = require('fs');
const readline = require('readline');
const zxcvbn = require('zxcvbn');
const AbstractReader = require("./abstract-reader.js");
require("../../console-verbose.js");

class TextReader extends AbstractReader {

	read() {
		return new Promise((resolve, reject) => {
			if (this.stream === null && this.path === null) {
				throw new Error("must set either path and/or stream");
			} else if (!this.stream) {
				this.stream = fs.createReadStream(this.path);
			}
			const words = [];
			const rl = readline.createInterface({
				input: this.stream,
				crlfDelay: Infinity
			});
			rl.on('line', (line) => {
				try {
					// parse word
					let word = this.parser.parse(line);
					console.verbose('word parsed: %s', word);
					// get password strength
					const passAssess = zxcvbn(word);
					let str = passAssess.score;
					console.verbose('password strength assessment (%s): %d', word, str);
					// get auto tags
					let tags = [];
					this.taggers.forEach((tagger) => {
						if (tagger.match(word)) {
							console.log('applying tag `%s` to %s', tagger.name, word);
							tags.push(tagger.name);
						}
					});
					// finish up
					words.push({
						word: word,
						length: word.length,
						strength: str,
						tags: tags
					});
				} catch (e) {
					reject(e);
				}
			});
			rl.on('close', () => {
				resolve(words);
			});
		});
	}

}

module.exports = TextReader;