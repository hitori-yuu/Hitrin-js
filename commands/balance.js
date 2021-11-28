const { SlashCommandBuilder } = require('@discordjs/builders');
const profileModel = require('../models/profileSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('あなたの残金を表示します。'),
	async execute(interaction) {
		const profileData = await profileModel.findOne({ userID: interaction.user.id });
		await interaction.reply(`あなたの残金は： **🪙${profileData.coins}** *coins*`);
	},
};