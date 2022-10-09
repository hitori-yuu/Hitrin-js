const { isAvailableUser, isCreatedUser, isCreatedGuild } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');

async function consentTOS(interaction) {
    if (!isCreatedUser) await createUserData(interaction.user);

    const Model = require(`../models/usersSchema`);
    const Data = await Model.findOneAndUpdate(
        {
            id: interaction.user.id,
        },
        {
            $set: {
                tos: true,
            },
        },
    );

    await Data.save();
    await interaction.followUp({
        content: '利用規約に**同意**しました。',
    });
};

async function opposeTOS(interaction) {
    if (!isCreatedUser) await createUserData(interaction.user);

    const Model = require(`../models/usersSchema`);
    const Data = await Model.findOneAndUpdate(
        {
            id: interaction.user.id,
        },
        {
            $set: {
                tos: false,
            },
        },
    );

    await Data.save();
    await interaction.followUp({
        content: '利用規約に**反対**しました。',
    });
};

module.exports = { consentTOS: consentTOS, opposeTOS: opposeTOS };