const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, codeBlock } = require('discord.js');

module.exports = {
	category: 'owner',

	data: new SlashCommandBuilder()
		.setName('servers')
		.setDescription('Displays servers bot joins.')
        .setDescriptionLocalizations({
            'en-US': 'Displays servers bot joins.',
            'ja': 'ボットが参加しているサーバーを表示します。',
        }),

	async execute(interaction) {
        await interaction.reply({
            content:  `計${interaction.client.guilds.cache.size} のサーバーに参加しています。${codeBlock(interaction.client.guilds.cache.map(server => server.name).join(', '))}`
        });
	},
};