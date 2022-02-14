const { SlashCommandBuilder } = require('@discordjs/builders');
const profileModel = require('../models/profileSchema');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('あなたの残金を表示します。'),
	async execute(interaction) {
		const profileData = await profileModel.findOne({ _id: interaction.user.id });
		await interaction.reply(`あなたの残金は: **🪙${profileData.coins}** コイン`);
	},
};