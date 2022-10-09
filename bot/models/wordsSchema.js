const mongoose = require('mongoose');

const wordsSchema = new mongoose.Schema({
    word: { type: String },
    word_id: { type: String },
    author: {
        name: { type: String },
        id: { type: String },
    },
    createdDate : { type: String },
});

module.exports = mongoose.model('Words', wordsSchema);
