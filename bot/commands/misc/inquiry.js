const { EmbedBuilder, SlashCommandBuilder, codeBlock } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('inquiry')
        .setNameLocalizations({
            'en-US': 'inquiry',
            'ja': '問い合わせ',
        })
        .setDescription('Send an inquiry to the Bot\'s management.')
        .setDescriptionLocalizations({
            'en-US': 'Send an inquiry to the Bot\'s management.',
            'ja': '全コマンドまたは特定のコマンドの詳細を表示します。',
        })
		.setDMPermission(true)
        .addStringOption(
            option => option
            .setName('content')
            .setNameLocalizations({
                'en-US': 'content',
                'ja': '内容',
            })
            .setDescription('Enter the inquiry details.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the inquiry details.',
                'ja': '問い合わせの内容を入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
		try {
            const content = interaction.options.getString('content');

            if (!content) return ArgumentError(interaction, content);

            const inquiryEmbed = new EmbedBuilder()
                .setColor('#93ca76')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setDescription(`以下の内容を送信しました。\n${codeBlock(content)}`)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            interaction.followUp({
                embeds: [inquiryEmbed]
            });
		} catch (error) {
			return InteractionError(error, interaction);
		}
	},
};
