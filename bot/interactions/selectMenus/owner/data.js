const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, PermissionsBitField, ChannelType, Collection } = require('discord.js');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData, logsData } = require('../../../functions/MongoDB');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { hasPermissions } = require('../../../functions/hasPermissions');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../../../functions/isAvailable');
const guildModel = require('../../../models/guildsSchema');
const config = require('../../../config.json');

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
};

module.exports = {
	id: 'data',

	async execute(interaction) {
        const selected = interaction.values[0];
        var guildData;

        switch (selected) {
            case 'dataMembers':
                interaction.update({
                    embeds: [StartEmbed('メンバー数')],
                    components: []
                });
                try {
                    console.log('[アナリティクス] データの取得を開始します。');
                    interaction.client.guilds.cache.forEach(async guild => {
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
                        guildData = await guildModel.findOneAndUpdate(
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
                        await interaction.client.channels.cache.get('1022444125980741642').send({
                            embeds: [logEmbed]
                        });
                    });
                    interaction.channel.send({
                        embeds: [SuccessEmbed('メンバー数の取得が完了しました。')]
                    });
                } catch (error) {
                    return interaction.channel.send({
                        embeds: [ErrorEmbed(error)]
                    });
                }
                break;
            case 'dataMessages':
                interaction.update({
                    embeds: [StartEmbed('メッセージ数')],
                    components: []
                });
                try {
                    console.log('[アナリティクス] データの取得を開始します。');
                    interaction.client.guilds.cache.forEach(async guild => {
                        if (!await isCreatedGuild(guild)) return;
                        if (!await hasPermissions(guild.members.cache.get(interaction.client.user.id), PermissionsBitField.Flags.ReadMessageHistory)) return;

                        var messageCount = {
                            member: 0,
                            user: 0,
                            bot: 0
                        };

                        guild.channels.cache.forEach(async channel => {
                            if (channel.type !== ChannelType.GuildText) return;
                            if (!channel.viewable) return;
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
                            await guildModel.findOneAndUpdate(
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
                            interaction.client.channels.cache.get('1022444125980741642').send({
                                embeds: [logEmbed]
                            });
                            interaction.channel.send({
                                embeds: [SuccessEmbed('メッセージ数の取得が完了しました。')]
                            });
                        }, 180000);
                    });
                } catch (error) {
                    return interaction.channel.send({
                        embeds: [ErrorEmbed(error)]
                    });
                }
                break;
        }
	},
};

function StartEmbed(type) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#59b9c6')
        .setAuthor({ name: `${type} の取得を開始します。`})
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    return errorEmbed;
};