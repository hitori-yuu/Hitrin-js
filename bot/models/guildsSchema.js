const mongoose = require('mongoose');

const guildsSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    settings: {
        autoMod: { type: Boolean },
        autoPublish: { type: Boolean },
        globalBan: { type: Boolean },
        authRole: { type: String },
    },
    createDate : { type: String },
});

const model = mongoose.model('Guilds', guildsSchema);

module.exports = model;
