const mongoose = require('mongoose');

const coins = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	coins: { type: Number, default: 1000 },
});

const model = mongoose.model('Coins', coins);

module.exports = model;