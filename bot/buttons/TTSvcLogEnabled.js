const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');

module.exports = {
	id: 'TTSvcLogEnabled',

	async execute(interaction) {
        try {
            if (!await isCreatedGuild(interaction.guild)) {
                await createGuildData(interaction.guild);
                CustomError(interaction, 'サーバーデータがありません。再度実行してください。');
                return;
            }
            const Model = require('../models/guildsSchema')
            await Model.updateOne(
                {
                    id: interaction.guild.id,
                },
                {
                    $set: {
                        'settings.TTS.vcLog': true
                    }
                },
            );

            const TTSvcLogEnabledEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription('ボイスチャンネルの参加・退出読み上げを**有効化**しました。')
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [TTSvcLogEnabledEmbed],
            });
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
