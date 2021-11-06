const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick the user from the server.')
		.addUserOption(option => option.setName('target').setDescription('The user'))
		.addStringOption(option => option.setName('reason').setDescription('The reason')),
	async execute(interaction, client) {
		const member = interaction.options.getMember('target');
		const reasons = interaction.options.getString('reason') || 'None';

		const permission = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('Unsuccessful execution')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('You don\'t have the permission to run it. Required: `KICK_MEMBERS`')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		if (!interaction.member.permissions.has('KICK_MEMBERS')) return await interaction.reply({ embeds: [permission] });

		const invalid = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('Unsuccessful execution')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('Invalid member')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		if (!member) return await interaction.reply({ embeds: [invalid] });

		const success = new MessageEmbed()
			.setColor('#028760')
			.setTitle(`Kicked: ${member.user.tag} | Executor: ${interaction.user.tag}`)
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription(`Reason: ${reasons}`)
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		await interaction.reply({ embeds: [success] });
		member.kick(reasons + '「' + reasons + `」by:${interaction.user.tag}`);
	},
};