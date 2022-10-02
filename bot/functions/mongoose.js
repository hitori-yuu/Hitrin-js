const mongoose = require('mongoose');
const { Error } = require('../handlers/error');
require('dotenv').config()

async function MongoDB() {
    try {
        mongoose
        .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
        })
        .then(() => {
            console.log('データベースに接続しました。');
        });
    } catch (error) {
        return Error(error);
    }
}

module.exports = { MongoDB };