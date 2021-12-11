const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
	_id: { type: String, require: true },
	evaluation: { type: Number, default: 10 },
	coins: { type: Number, default: 2500 },
});

const model = mongoose.model('Profiles', profileSchema);

module.exports = model;