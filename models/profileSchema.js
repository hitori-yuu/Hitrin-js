const mongoose = require('mongoose');

const profileData = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	evaluation: { type: Number, default: 10 },
	coins: { type: Number, default: 1000 },
});

const model = mongoose.model('Profiles', profileData);

module.exports = model;