const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle, codeBlock } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');

module.exports = {
	id: 'settingAntiLinks',

	async execute(interaction) {
        try {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('antiLinksAdd')
                        .setLabel('リンク追加')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('antiLinksRemove')
                        .setLabel('リンク削除')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('antiLinksIgnore')
                        .setLabel('無効チャンネル')
                        .setStyle(ButtonStyle.Secondary),
                );

            const data = await guildsData(interaction.guild);
            var ignoredChannels = [];
            if (data.autoMod.antiLinks.ignore) {
                data.autoMod.antiLinks.ignore.forEach(id => {
                    ignoredChannels.push(interaction.guild.channels.cache.get(id).name);
                    console.log(interaction.guild.channels.cache.get(id).name)
                });
            };

            var Channels = ignoredChannels;
            if (ignoredChannels.length > 1) Channels = ignoredChannels.join(', ');

            const settingAntiLinksEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setFields(
                    {
                        name: '**__リンク一覧:__**',
                        value: codeBlock(data.autoMod.antiLinks.links.join(', ') || 'None')
                    },
                    {
                        name: '**__無効チャンネル:__**',
                        value: codeBlock(Channels || 'None')
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [settingAntiLinksEmbed],
                components: [row],
            });
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
