const mongoose = require('mongoose');

const touhouCharactersSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    alias: { type: Array },
    pronunciation: { type: String },
    icon: { type: String },
    race: { type: String },
    nickname: { type: Array },
    ability: { type: String },
    description: { type: String },
    author: {
        name: { type: String },
        id: { type: String },
    },
    updatedDate : { type: String },
});

module.exports = mongoose.model('touhouCharacters', touhouCharactersSchema);
