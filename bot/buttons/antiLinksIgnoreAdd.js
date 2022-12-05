const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle, codeBlock } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');
const Model = require('../models/guildsSchema')

module.exports = {
	id: 'antiLinksIgnoreAdd',

	async execute(interaction) {
        try {
            const loggingCh = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription('**30秒以内に** リンク無効化チャンネルに設定したいチャンネルのIDまたはチャンネル名を入力してください。\n30秒経過すると以前の設定を維持します。')
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [loggingCh],
            });

            const filter = message => message.author.id === interaction.user.id;
			interaction.channel.awaitMessages({ filter, max: 1, time: 30000 })
				.then(async collected => {
                    const data = await guildsData(interaction.guild);
                    if (!data) {
                        await createGuildData(interaction.guild);
                        CustomError(interaction, 'サーバーデータがありません。再度実行してください。');
                        return;
                    }
                    const before = await ignoredChannels(data, interaction);
                    var beforeChannels = before;
                    if (before.length  > 1) beforeChannels = before.join(', ');

                    const antiLinksIgnore = new EmbedBuilder()
                        .setColor('#59b9c6')
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                        .setFields(
                            {
                                name: '**__無効チャンネル:__**',
                                value: codeBlock(beforeChannels || 'None')
                            },
                        )
                        .setTimestamp()
                        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                    if (!collected.size) return interaction.channel.send({ embeds: [antiLinksIgnore], ephemeral: true });

					const channel = interaction.guild.channels.cache.find((ch) => ch.name === collected.first().content) || interaction.guild.channels.cache.get(collected.first().content);
					if (!channel) return ArgumentError(interaction, channel);
                    if (before.includes(channel.name)) return CustomError(interaction, 'そのチャンネルはすでに追加されています');

                    await Model.updateOne(
                        {
                            id: interaction.guild.id,
                        },
                        {
                            $push: {
                                'autoMod.antiLinks.ignore': channel.id
                            }
                        },
                    );

                    const after = await ignoredChannels(data, interaction);
                    var afterChannels = after;
                    if (after.length > 1) afterChannels = after.join(', ');
                    const antiLinksIgnoreAdded = new EmbedBuilder()
                        .setColor('#93ca76')
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                        .setFields(
                            {
                                name: '**__無効チャンネル:__**',
                                value: codeBlock(afterChannels || 'None')
                            },
                        )
                        .setTimestamp()
                        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                    await interaction.channel.send({
                        embeds: [antiLinksIgnoreAdded],
                        ephemeral: true,
                    });
				});
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};

async function ignoredChannels(data, interaction) {
    var ignoredChannels = [];
    if (data.autoMod.antiLinks.ignore) {
        data.autoMod.antiLinks.ignore.forEach(id => {
            ignoredChannels.push(interaction.guild.channels.cache.get(id).name);
        });
        return ignoredChannels;
    };
}