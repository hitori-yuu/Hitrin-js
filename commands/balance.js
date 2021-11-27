const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('あなたの残金を表示します。'),
	async execute(interaction) {
		const profileModel = require('../models/coins.js');
		const profileData = await profileModel.findOne({ userID: interaction.user.id });
		await interaction.reply(`あなたの残金は： **🪙${profileData.coins}** *coins*`);
	},
};