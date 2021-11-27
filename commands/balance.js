const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Show your balance.'),
	async execute(interaction) {
		const profileModel = require('../models/coins.js');
		const profileData = await profileModel.findOne({ userID: interaction.user.id });
		await interaction.reply(`Your balance : **🪙${profileData.coins}** *coins*`);
	},
};