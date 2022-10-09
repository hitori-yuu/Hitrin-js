const mongoose = require('mongoose');

const warnsSchema = new mongoose.Schema({
    guild: {
        name: { type: String },
        id: { type: String },
    },
    subject: {
        name: { type: String },
        id: { type: String },
    },
    author: {
        name: { type: String },
        id: { type: String },
    },
    reason: { type: String },
    createdDate : { type: String },
});

module.exports = mongoose.model('Warns', warnsSchema);
