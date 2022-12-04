const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('settings')
        .setNameLocalizations({
            'en-US': 'settings',
            'ja': '設定',
        })
        .setDescription('Displays information about all commands or that command.')
        .setDescriptionLocalizations({
            'en-US': 'Displays information about all commands or that command.',
            'ja': '全コマンドまたは特定のコマンドの詳細を表示します。',
        })
		.setDMPermission(true),

	async execute(interaction) {
        try {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settingAutoMod')
                        .setEmoji('1⃣')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settingTTS')
                        .setEmoji('2⃣')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settingAutoPublish')
                        .setEmoji('3⃣')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settingLog')
                        .setEmoji('4⃣')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settingMeetingCh')
                        .setEmoji('5⃣')
                        .setStyle(ButtonStyle.Secondary),
                );

            const settingsEmbed = new EmbedBuilder()
                .setColor('#93ca76')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription('以下のいずれかのボタンをクリックして設定を行ってください。\n\n**1⃣:** 自動管理についての設定\n**2⃣:** 読み上げに関する設定\n**3⃣:** 自動公開に関する設定\n**4⃣:** ログに関する設定\n**5⃣:** ミーティングチャンネルに関する設定')
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [settingsEmbed],
                components: [row],
            });
        } catch (error) {
			return InteractionError(interaction, error);
        }
	},
};
