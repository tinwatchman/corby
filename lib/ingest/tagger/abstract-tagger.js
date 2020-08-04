class AbstractTagger {

	constructor() {
		this._name = null;
	}

	get name() {
		return this._name;
	}

	set name(name) {
		this._name = name;
	}

	match(str) {
		throw new Error('Must override abstract method in subclass');
	}

}

module.exports = AbstractTagger;