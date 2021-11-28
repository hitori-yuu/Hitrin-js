const mongoose = require('mongoose');

const bans = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	reason: { type: String },
	date: { type: Date },
});

const model = mongoose.model('GlobalBans', bans);

module.exports = model;