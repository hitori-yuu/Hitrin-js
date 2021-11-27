const { SlashCommandBuilder } = require('@discordjs/builders');
const cooldown = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-coin')
		.setDescription('Take action to get coins.')
		.addStringOption(option => option.setName('type').setDescription('the type').addChoice('Work', 'w').addChoice('Steal', 's').addChoice('Assist', 'a')),
	async execute(interaction) {
		if (cooldown.has(interaction.user.id)) return await interaction.reply('This command can only be executed once every 5 minutes.');
		const profileModel = require('../models/coins.js');
		const type = interaction.options.getString('type');
		if (type === 'w') {
			const amount_w = Math.floor(Math.random() * (60 + 1 - 30)) + 30;
			await interaction.reply(`You've got coins! -> **🪙${amount_w.toString()}** *coins*`);
			await profileModel.findOneAndUpdate(
				{
					userID: interaction.user.id,
				},
				{
					$inc: {
						coins: amount_w,
					},
				},
			);
			cooldown.add(interaction.user.id);
			setTimeout(() => {
				cooldown.delete(interaction.user.id);
			}, 300000);
		}

		else if (type === 'a') {
			await interaction.reply('You\'ve got coins! -> **🪙45** *coins*');
			await profileModel.findOneAndUpdate(
				{
					userID: interaction.user.id,
				},
				{
					$inc: {
						coins: 45,
					},
				},
			);
			cooldown.add(interaction.user.id);
			setTimeout(() => {
				cooldown.delete(interaction.user.id);
			}, 300000);
		}

		else if (type === 's') {
			const amount_s = Math.floor(Math.random() * (250 + 1 - 30)) - 100;
			if (Math.sign(amount_s) == 1) {
				await interaction.reply(`You've got coins! -> **🪙${amount_s.toString()}** *coins*`);
			}
			else if (Math.sign(amount_s) == -1) {
				await interaction.reply(`You've lost your coins! -> **🪙${amount_s.toString()}** *coins*`);
			}
			else {
				await interaction.reply('Your money didn\'t grow...');
			}
			await profileModel.findOneAndUpdate(
				{
					userID: interaction.user.id,
				},
				{
					$inc: {
						coins: amount_s,
					},
				},
			);
			cooldown.add(interaction.user.id);
			setTimeout(() => {
				cooldown.delete(interaction.user.id);
			}, 300000);
		}
	},
};