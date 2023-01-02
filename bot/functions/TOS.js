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
    await interaction.update({
        content: '利用規約に**同意**しました。',
        embeds: [],
        components: [],
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
    await interaction.update({
        content: '利用規約に**反対**しました。',
        embeds: [],
        components: [],
    });
};

module.exports = { consentTOS: consentTOS, opposeTOS: opposeTOS };