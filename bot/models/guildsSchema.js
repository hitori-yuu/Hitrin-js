const mongoose = require('mongoose');

const guildsSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    settings: {
        autoMod: { type: Boolean, default: false },
        autoPublish: { type: Boolean, default: false },
        meetingChannel: { type: String, default: 'None' },
        globalBan: { type: Boolean, default: false },
        authRole: { type: String, default: 'None' },
        TTS: {
            vcLog: { type: Boolean, default: false },
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
        boolean: { type: Boolean, default: false },
        channel: {
            name: { type: String, default: 'None'},
            id: { type: String, default: 'None' },
        },
    },
    createdDate : { type: String },
});

module.exports = mongoose.model('Guilds', guildsSchema);
