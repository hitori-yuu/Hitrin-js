const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
    command: { type: String },
    args: { type: Array },
    executer: {
        name: { type: String },
        id: { type: String },
    },
    locate: {
        name: { type: String },
        id: { type: String },
        dm: { type: Boolean },
    },
    createdDate : { type: String },
});

module.exports = mongoose.model('Logs', logsSchema);
