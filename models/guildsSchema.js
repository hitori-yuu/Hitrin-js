const mongoose = require('mongoose');

const guildsSchema = new mongoose.Schema({
	_id: { type: String, require: true, required: true },
	ownerID: { type: String },
	welcomeCh: { type: String, unique: true, default: 'none' },
	globalBan: { type: Boolean, default: true },
	autoMod: { type: Boolean, default: true },
	setting: {
		log: { type: String, unique: true, default: 'none' },
		level: { type: String, unique: true, default: 'normal', enum: ['master', 'high', 'normal', 'low'], }
	}
});

const model = mongoose.model('Guilds', guildsSchema);

module.exports = model;