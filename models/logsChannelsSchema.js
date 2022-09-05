const mongoose = require('mongoose');

const logsChannelSchema = new mongoose.Schema({
    guild: {
        name: { type: String },
        id: { type: String },
    },
    channel: {
        name: { type: String },
        id: { type: String },
    },
    author: {
        name: { type: String },
        id: { type: String },
    },
    date: { type: String },
});

const model = mongoose.model('LogsChannel', logsChannelSchema);

module.exports = model;