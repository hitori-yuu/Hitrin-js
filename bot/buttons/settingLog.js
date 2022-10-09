const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');

module.exports = {
	id: 'settingLog',

	async execute(interaction) {
        try {
            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('settingLogEnabled')
                    .setLabel('有効化')
                    .setEmoji('✔')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('settingLogDisabled')
                    .setLabel('無効化')
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Secondary),
            );

        const TTSvcLogEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
            .setDescription('**ボイスチャンネルの参加・退出読み上げ** を有効化・無効化します。\n以下のいずれかのボタンをクリックしてください。')
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        await interaction.followUp({
            embeds: [TTSvcLogEmbed],
            components: [row],
        });
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
