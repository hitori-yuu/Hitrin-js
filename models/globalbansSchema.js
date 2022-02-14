const mongoose = require('mongoose');

const globalbansSchema = new mongoose.Schema({
	_id: { type: String },
	reason: { type: String },
	date: { type: Date },
});

const model = mongoose.model('GlobalBans', globalbansSchema);

module.exports = model;