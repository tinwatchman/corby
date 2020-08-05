const Joi = require('@hapi/joi');

const WordSchema = Joi.object({
	id: Joi.number().integer().positive().allow(null),
	word: Joi.string().required(),
	length: Joi.number().integer().positive().required(),
	strength: Joi.number().allow(0, 1, 2, 3, 4, null).required(),
	created: Joi.date().required(),
	updated: Joi.date().required()
});

class Word {

	constructor() {
		this.id = null;
		this.word = null;
		this.length = 0;
		this.strength = null;
		this.created = null;
		this.updated = null;
		this.files = [];
		this.tags = [];
	}

	hasFile(fileName) {
		return this.files.some((file) => {
			return (file.name === fileName);
		});
	}

	hasTag(tagName) {
		return this.tags.some((tag) => {
			return (tag.name === tagName);
		});
	}

	static fromRow(row) {
		let word = new Word();
		word.id = row.id;
		word.word = row.word;
		word.length = row.length;
		word.strength = row.strength;
		word.created = new Date(row.created);
		word.updated = new Date(row.updated);
		return word;
	}

	static validate(obj) {
		return WordSchema.validate(obj);
	}

}

module.exports = Word;