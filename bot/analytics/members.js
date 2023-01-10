const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../functions/embeds');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');
const guildModel = require('../models/guildsSchema');
const config = require('../config.json');
const cron = require('node-cron');
const { hasPermissions } = require('../functions/hasPermissions');

module.exports = {
	name: 'ready',

	async execute(client) {
        cron.schedule('0 0 9 * * *', () => {
            console.log('[アナリティクス] データの取得を開始します。');
            client.guilds.cache.forEach(async guild => {
                if (!await isCreatedGuild(guild)) return;

                var today = new Date();
                var year = today.getFullYear();
                var month = today.getMonth() + 1;
                var day = today.getDate();

                const members = guild.members.cache;

                const logEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setAuthor({ name: `メンバー数の取得が完了しました。`})
                    .setThumbnail(guild.iconURL({ extension: 'png' }))
                    .addFields(
                        {
                            name: '__**一般:**__',
                            value: `**[名前]** ${guild.name}\n**[ID]** ${guild.id}\n**[オーナー]** <@${guild.ownerId}>`
                        },
                        {
                            name: '__**メンバー数:**__',
                            value: `**[メンバー]** ${members.size}\n**[ユーザー]** ${members.filter(member => !member.user.bot).size}\n**[ボット]** ${members.filter(member => member.user.bot).size}`
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
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
                await client.channels.cache.get('1022444125980741642').send({
                    embeds: [logEmbed]
                });
            });
        });
	},
};
