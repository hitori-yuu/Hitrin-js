const mongoose = require('mongoose');

const guildsSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    settings: {
        autoMod: { type: Boolean, default: true },
        autoPublish: { type: Boolean, default: true },
        meetingChannel: { type: String, default: 'None' },
        globalBan: { type: Boolean, default: true },
        authRole: { type: String, default: 'None' },
        TTS: {
            vcLog: { type: Boolean, default: true },
        }
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
    logging: {
        enable: { type: Boolean, default: false },
        channel: {
            name: { type: String, default: 'None'},
            id: { type: String, default: 'None' },
        },
    },
    createdDate : { type: String },
});

module.exports = mongoose.model('Guilds', guildsSchema);
