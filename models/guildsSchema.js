const mongoose = require('mongoose');

const guildsSchema = new mongoose.Schema({
	_id: { type: String },
	ownerId: { type: String },
	welcomeCh: { type: String },
	settings: {
		autoMod: { type: Boolean, default: true },
		autoPublish: { type: Boolean, default: true },
		globalBan: { type: Boolean, default: true },
		auth_role: { type: String },
		log: { type: String },
		level: { type: String, enum: ['master', 'high', 'normal', 'low'] },
	}
});

const model = mongoose.model('Guilds', guildsSchema);

module.exports = model;