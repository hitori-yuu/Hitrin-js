const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle, codeBlock } = require('discord.js');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');

module.exports = {
	id: 'antiLinksIgnore',

	async execute(interaction) {
        try {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('antiLinksIgnoreAdd')
                        .setLabel('チャンネル追加')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('antiLinksIgnoreRemove')
                        .setLabel('チャンネル削除')
                        .setStyle(ButtonStyle.Secondary),
                );

            const data = await guildsData(interaction.guild);
            if (!data) {
                await createGuildData(interaction.guild);
                CustomError(interaction, 'サーバーデータがありません。再度実行してください。');
                return;
            }
            var ignoredChannels = [];
            if (data.autoMod.antiLinks.ignore) {
                data.autoMod.antiLinks.ignore.forEach(id => {
                    ignoredChannels.push(interaction.guild.channels.cache.get(id).name);
                    console.log(interaction.guild.channels.cache.get(id).name)
                });
            };

            var Channels = ignoredChannels;
            if (ignoredChannels.length > 1) Channels = ignoredChannels.join(', ');

            const settingsAutoModEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setFields(
                    {
                        name: '**__無効チャンネル:__**',
                        value: codeBlock(Channels || 'None')
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [settingsAutoModEmbed],
                components: [row],
            });
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
