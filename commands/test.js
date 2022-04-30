const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('テストコマンド'),
	async execute(interaction) {
		console.log(interaction.channel.fetch());
		await interaction.reply('テスト');
	},
};