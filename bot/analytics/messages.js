const { EmbedBuilder, ChannelType } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../functions/embeds');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');
const guildModel = require('../models/guildsSchema');
const config = require('../config.json');
const cron = require('node-cron');

const { Collection } = require('discord.js');

async function fetchMore(channel, limit = 500) {
    if (!channel) {
        throw new Error(`Expected channel, got ${typeof channel}.`);
    }
    if (limit <= 100) {
        return channel.messages.fetch({ limit });
    }

    let collection = new Collection();
    let lastId = null;
    let options = {};
    let remaining = limit;

    while (remaining > 0) {
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;

        if (lastId) {
        options.before = lastId;
        }

        let messages = await channel.messages.fetch(options);

        if (!messages.last()) {
        break;
        }

        collection = collection.concat(messages);
        lastId = messages.last().id;
    }

    return collection;
}

module.exports = {
	name: 'ready',

	async execute(client) {
        cron.schedule('0 0 9 * * *', () => {
            client.guilds.cache.forEach(async guild => {
                if (!await isCreatedGuild(guild)) return;
                console.log('[アナリティクス] データの取得を開始します。');

                var messageCount = {
                    member: 0,
                    user: 0,
                    bot: 0
                };

                guild.channels.cache.forEach(async channel => {
                    if (channel.type !== ChannelType.GuildText) return;
                    const msg = await fetchMore(channel, 5000);
                    messageCount.member += msg.size;
                    messageCount.user += msg.filter(msg => !msg.author.bot).size;
                    messageCount.bot += msg.filter(msg => msg.author.bot).size;
                });

                var today = new Date();
                var year = today.getFullYear();
                var month = today.getMonth() + 1;
                var day = today.getDate();

                setTimeout(async () => {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#59b9c6')
                        .setAuthor({ name: `メッセージ数の取得が完了しました。`})
                        .setThumbnail(guild.iconURL({ extension: 'png' }))
                        .addFields(
                            {
                                name: '__**一般:**__',
                                value: `**[名前]** ${guild.name}\n**[ID]** ${guild.id}\n**[オーナー]** <@${guild.ownerId}>`
                            },
                            {
                                name: '__**メッセージ数:**__',
                                value: `**[総メッセージ]** ${messageCount.member}\n**[ユーザー]** ${messageCount.user}\n**[ボット]** ${messageCount.bot}`
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
                                'analytics.messages': {
                                    'member': messageCount.member,
                                    'user': messageCount.user,
                                    'bot': messageCount.bot,
                                    'date': `${year}/${month}/${day}`,
                                }
                            },
                        },
                    );
                    guildData.save();
                    await client.channels.cache.get('1022444125980741642').send({
                        embeds: [logEmbed]
                    });
                }, 600000);
            });
        });
	},
};
