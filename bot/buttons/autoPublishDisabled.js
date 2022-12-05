const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');

module.exports = {
	id: 'autoPublishDisabled',

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
                        'settings.autoPublish': false
                    }
                },
            );

            const TTSvcLogDisabledEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription('ニュースチャンネルでの自動公開機能を**無効化**しました。')
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [TTSvcLogDisabledEmbed],
            });
        } catch (error) {
            console.log(error);
            return InteractionError(interaction, error);
        }
	},
};
