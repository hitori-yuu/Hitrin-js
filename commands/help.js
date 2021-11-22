const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Show the help'),
	async execute(interaction, client) {
		const u = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('User Details')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.addFields(
				{ name: '__**Settings:**__', value: '`set-nick <STRING>`: Set the nickname of the BOT.' },
				{ name: '__**Useful:**__', value: '`docs <STRING>`: Searching for in discord.js docs.\n`info <TYPE> [TARGET]`: Show its details.' },
				{ name: '__**Playing:**__', value: '`omikuji`: Draw a fortune.\n`dice <TIMES> <SIDE>`: Roll the dice.' },
				{ name: '__**Management:**__', value: '`kick <TARGET> [REASON]`: Kick the user from the server.\n`ban <TARGET> [REASON] [DAYS]`: Ban the user from the server.\n`unban <TARGET> [REASON]`: Remove the ban of the user from the server.' },
			)
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		await interaction.reply({ embeds: [u] });
	},
};