const mongoose = require('mongoose');

const guildsSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    settings: {
        autoMod: { type: Boolean, default: true },
        autoPublish: { type: Boolean, default: true },
        globalBan: { type: Boolean, default: true },
        authRole: { type: String, default: 'None' },
    },
    autoMod: {
        blacklistsWords: {
            permission: { type: Boolean, default: false },
            words: { type: Array , default: 'None'},
            ignore: { type: Array, default: 'None' },
        },
        antiInvite: {
            permission: { type: Boolean, default: false },
            ignore: { type: Array, default: 'None' },
        },
        antiCapitals: {
            permission: { type: Boolean, default: false },
            ignore: { type: Array, default: 'None' },
        },
        antiLinks: {
            permission: { type: Boolean, default: false },
            links: { type: Array, default: 'None' },
            ignore: { type: Array, default: 'None' },
        },
    },
    createdDate : { type: String },
});

const model = mongoose.model('Guilds', guildsSchema);

module.exports = model;
