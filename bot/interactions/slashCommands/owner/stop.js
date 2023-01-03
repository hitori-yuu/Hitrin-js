const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	category: 'owner',

	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops this bot.')
        .setDescriptionLocalizations({
            'en-US': 'Stops this bot.',
            'ja': 'ボットを終了させます。',
        }),

	async execute(interaction) {
        await interaction.reply({
            content:  'ボットを終了させました。'
        });
        await interaction.client.destroy(true);
        console.log('stopコマンドによりボットが終了しました。');
	},
};