const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, codeBlock } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');

module.exports = {
	category: 'owner',

	data: new SlashCommandBuilder()
		.setName('send')
		.setDescription('Displays servers bot joins.')
        .setDescriptionLocalizations({
            'en-US': 'Displays servers bot joins.',
            'ja': 'ボットが参加しているサーバーを表示します。',
        }),

	async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('send')
            .setTitle('送信')
            .setComponents(
                new ActionRowBuilder()
                    .setComponents(
                        new TextInputBuilder()
                            .setCustomId('userIdInput')
                            .setLabel('送信するユーザーのIDを入力。')
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                    ),
                new ActionRowBuilder()
                    .setComponents(
                        new TextInputBuilder()
                            .setCustomId('contentInput')
                            .setLabel('内容をを入力。')
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                    )
            );

        await interaction.showModal(modal);
	},
};