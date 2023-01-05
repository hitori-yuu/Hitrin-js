const { EmbedBuilder } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../functions/embeds');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');
const guildModel = require('../models/guildsSchema');
const config = require('../config.json');
const cron = require('node-cron');

module.exports = {
	name: 'ready',

	async execute(client) {
        cron.schedule('0 0 9 * * *', () => {
            client.guilds.cache.forEach(async guild => {
                if (!await isCreatedGuild(guild)) return;

                var today = new Date();
                var year = today.getFullYear();
                var month = today.getMonth() + 1;
                var day = today.getDate();

                const members = guild.members.cache;
                const guildData = await guildModel.findOneAndUpdate(
                    {
                        id: guild.id,
                    },
                    {
                        $push: {
                            'analytics.members': {
                                'member': members.size,
                                'user': members.filter(member => !member.user.bot).size,
                                'bot': members.filter(member => member.user.bot).size,
                                'date': `${year}/${month}/${day}`,
                            }
                        },
                    },
                );
                guildData.save();
            });
        });
	},
};
