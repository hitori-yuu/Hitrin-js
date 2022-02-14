const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
	_id: { type: String },
	name: { type: String },
	avatar: { type: String },
	color: { type: String },
	birthday: {
		date: { type: Date },
		public: { type: Boolean },
	},
	description: { type: String },
	evaluation: { type: Number, min: 0, max: 10 },
	coins: { type: Number},
});

const model = mongoose.model('Profiles', profileSchema);

module.exports = model;