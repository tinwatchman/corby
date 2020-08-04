const Joi = require('@hapi/joi');

const TagSchema = Joi.object({
	id: Joi.number().integer().positive().allow(null),
	tag: Joi.string().required(),
	type: Joi.string(),
	created: Joi.date().required(),
	updated: Joi.date().required()
});

class Tag {

	constructor() {
		this.id = null;
		this.tag = null;
		this.type = null;
		this.created = null;
		this.updated = null;
	}

	static fromRow(row) {
		let t = new Tag();
		t.id = (row.id) ? row.id : row.tag_id;
		t.tag = row.tag;
		t.type = row.type;
		t.created = new Date(row.created);
		t.updated = new Date(row.updated);
		return t;
	}

	static validate(obj) {
		return TagSchema.validate(obj);
	}

}

module.exports = Tag;