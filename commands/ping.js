const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('「Pong!」と返答します。'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};