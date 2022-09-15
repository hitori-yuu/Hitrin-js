const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    id: { type: String },
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
    createDate : { type: String },
});

const model = mongoose.model('Users', usersSchema);

module.exports = model;
