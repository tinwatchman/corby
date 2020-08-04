const Joi = require('@hapi/joi');

const FileSchema = Joi.object({
	id: Joi.number().integer().positive().allow(null),
	name: Joi.string().required(),
	path: Joi.string().required(),
	type: Joi.string().optional(),
	format: Joi.string().optional(),
	created: Joi.date().required(),
	updated: Joi.date().required()
});

class SourceFile {

	constructor() {
		this.id = null;
		this.name = null;
		this.path = null;
		this.url = null;
		this.type = null;
		this.format = null;
		this.created = null;
		this.updated = null;
	}

	static fromRow(obj) {
		let f = new SourceFile();
		f.id = (obj.id) ? obj.id : obj.file_id;
		f.name = obj.name;
		f.path = obj.path;
		f.url = (obj.url) ? obj.url : null;
		f.type = obj.type;
		f.format = obj.format;
		f.created = new Date(obj.created);
		f.updated = new Date(obj.updated);
		return f;
	}

	static validate(obj) {
		return FileSchema.validate(obj);
	}

}

module.exports = SourceFile;