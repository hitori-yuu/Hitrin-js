const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String },
    tos: { type: Boolean },
    evaluation: { type: Number, min: 0, max: 10 },
    speaker: { type: Number },
    profile: {
        avatar: { type: String },
        color: { type: String },
        description: { type: String },
        birthday: {
            date: { type: Date },
            public: { type: Boolean },
        }
    },
    createdDate : { type: String },
});

module.exports = mongoose.model('Users', usersSchema);
