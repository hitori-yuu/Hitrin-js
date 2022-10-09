const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');

module.exports = {
	id: 'settingAutoModBoolean',

	async execute(interaction) {
        try {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('autoModEnabled')
                        .setLabel('有効化')
                        .setEmoji('✔')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('autoModDisabled')
                        .setLabel('無効化')
                        .setEmoji('❌')
                        .setStyle(ButtonStyle.Secondary),
                );

            const settingsAutoModEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription('**自動管理機能** を有効化・無効化します。\n以下のいずれかのボタンをクリックしてください。')
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
