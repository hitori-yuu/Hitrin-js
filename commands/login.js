const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const cooldown = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('login')
		.setDescription('Receive login rewards.'),
	async execute(interaction, client) {
		if (cooldown.has(interaction.user.id)) return await interaction.reply('This command can only be executed once every 24 hours.');
		const login = new MessageEmbed()
			.setColor('#ffdb4f')
			.setTitle('Login rewards!')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('__You have received the following rewards!__\n**🪙250** *coins*')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		await interaction.reply({ embeds: [login] });
		const profileModel = require('../models/coins.js');
		await profileModel.findOneAndUpdate(
			{
				userID: interaction.user.id,
			},
			{
				$inc: {
					coins: 250,
				},
			},
		);
		cooldown.add(interaction.user.id);
		setTimeout(() => {
			cooldown.delete(interaction.user.id);
		}, 86400000);
	},
};