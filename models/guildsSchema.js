const mongoose = require('mongoose');

const guildsSchema = new mongoose.Schema({
	_id: { type: String },
	ownerId: { type: String },
	welcomeCh: { type: String },
	globalBan: { type: Boolean, default: true },
	autoMod: { type: Boolean, default: true },
	setting: {
		log: { type: String },
		level: { type: String, enum: ['master', 'high', 'normal', 'low'] }
	}
});

const model = mongoose.model('Guilds', guildsSchema);

module.exports = model;