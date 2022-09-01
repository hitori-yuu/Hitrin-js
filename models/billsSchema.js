const mongoose = require('mongoose');

const billsSchema = new mongoose.Schema({
    name: { type: String },
    author: {
        name: { type: String },
        id: { type: String },
    },
    agree: { type: Number },
    oppose: { type: Number },
    result: { type: String },
    date: { type: String },
    finished: { type: Boolean },
});

const model = mongoose.model('Bills', billsSchema);

module.exports = model;