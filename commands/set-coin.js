const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-coin')
		.setDescription('Set the user\'s coins ※Only bot management')
		.addUserOption(option => option.setName('target').setDescription('the user'))
		.addNumberOption(option => option.setName('coins').setDescription('The coins')),
	async execute(interaction) {
		if (!interaction.user.id === '874184214130602015') return;
		const user = interaction.options.getUser('target');
		const coins = interaction.options.getNumber('coins');
		const profileModel = require('../models/coins.js');
		await profileModel.findOneAndUpdate(
			{
				userID: user.id,
			},
			{
				coins: coins,
			},
		);
		await interaction.reply(`Set <@${user.id}>'s coins -> **${coins}** *coins*`);
	},
};