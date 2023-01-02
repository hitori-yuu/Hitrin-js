const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    category: 'misc',

	data: new SlashCommandBuilder()
		.setName('request')
        .setDescription('Send requests for new features, bug fixes, etc. to the management.')
        .setDescriptionLocalizations({
            'en-US': 'Send requests for new features, bug fixes, etc. to the management.',
            'ja': '運営に新機能やバグ修正などの要望を送信します。',
        }),

	async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('request')
            .setTitle('要望送信')
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId('requestInput')
                        .setLabel('運営に新機能やバグ修正などの要望を送信します。')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                ),
            );

        await interaction.showModal(modal);
	},
};