const mongoose = require('mongoose');

const meetingsSchema = new mongoose.Schema({
    agenda: { type: String },
    executer: {
        name: { type: String },
        id: { type: String },
    },
    locate: {
        name: { type: String },
        id: { type: String },
    },
    agree: { type: Number, default: 0 },
    oppose: { type: Number, default: 0 },
    isClosed: { type: Boolean, default: false },
    messageId: { type: String, default: 'None' },
    createdDate : { type: String },
});

module.exports = mongoose.model('Meetings', meetingsSchema);
