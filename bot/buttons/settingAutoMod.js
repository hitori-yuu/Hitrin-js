const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');

module.exports = {
	id: 'settingAutoMod',

	async execute(interaction) {
        try {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settingAutoModBoolean')
                        .setEmoji('1⃣')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settingBlack')
                        .setEmoji('2⃣')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settingBlackWords')
                        .setEmoji('3⃣')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settingAntiInvite')
                        .setEmoji('4⃣')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('settingAntiLinks')
                        .setEmoji('5⃣')
                        .setStyle(ButtonStyle.Secondary),
                );

            const settingsAutoModEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription('以下のいずれかのボタンをクリックして設定を行ってください。\n\n**1⃣:** 自動管理の有効・無効化\n**2⃣:** 禁止ワードの設定\n**3⃣:** 招待無効化の設定\n**4⃣:** 大文字無効化の設定\n**5⃣:** リンク無効化の設定')
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
