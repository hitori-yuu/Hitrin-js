const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('任意の文字列をボットに言わせます。')
		.addStringOption(option => option.setName('args').setDescription('The words')),
	async execute(interaction) {
		const arg = interaction.options.getString('args') || '.';
		await interaction.reply(arg);
	},
};