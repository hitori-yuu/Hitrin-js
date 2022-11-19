
async function isCreatedUser(user) {
    const Model = require(`../models/usersSchema`);
    const DB = await Model.find();
    const Data = await DB.filter(data => data.id === user.id);
    var checkData = true;
    if (Data.length <= 0) checkData = false;

    return checkData;
};

async function isCreatedGuild(guild) {
    const Model = require(`../models/guildsSchema`);
    const DB = await Model.find();
    const Data = await DB.filter(data => data.id === guild.id);
    var checkData = true;
    if (Data.length <= 0) checkData = false;

    return checkData;
};

async function isAvailableUser(user) {
    const Model = require(`../models/usersSchema`);
    const DB = await Model.find();
    const Data = await DB.filter(data => data.id === user.id);

    return Data[0].tos;
};


module.exports = { isCreatedUser, isCreatedGuild, isAvailableUser };