const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');

module.exports = {
	id: 'autoModDisabled',

	async execute(interaction) {
        try {
            const Model = require('../models/guildsSchema')
            await Model.updateOne(
                {
                    id: interaction.guild.id,
                },
                {
                    $set: {
                        'settings.autoMod': false
                    }
                },
            );

            const autoModEnabledEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription('自動管理機能を**無効化**しました。')
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [autoModEnabledEmbed],
            });
        } catch (error) {
            console.log(error);
            return InteractionError(interaction, error);
        }
	},
};
