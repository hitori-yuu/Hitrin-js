const usersModel = require('../models/usersSchema');

async function isAvailable(interaction) {
    const usersData = await usersModel.find();
    const data = usersData.filter(data => data.id  === interaction.user.id);

    return data[0].tos;
}

module.exports = { isAvailable };