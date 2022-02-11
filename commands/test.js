const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('「Pong!」と返答します。'),
	async execute(interaction) {
		console.log(interaction.channel.fetch());
		await interaction.reply('test');
	},
};