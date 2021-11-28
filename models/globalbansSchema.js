const mongoose = require('mongoose');

const globalbansSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	reason: { type: String },
	date: { type: Date },
});

const model = mongoose.model('GlobalBans', globalbansSchema);

module.exports = model;