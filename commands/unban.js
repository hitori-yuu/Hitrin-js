const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Cancel the ban of the user from the server.')
		.addUserOption(option => option.setName('target').setDescription('The user'))
		.addStringOption(option => option.setName('reason').setDescription('The reason')),
	async execute(interaction, client) {
		const user = interaction.options.getUser('target');
		const reasons = interaction.options.getString('reason') || 'None';

		const permission = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('Unsuccessful execution')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('You don\'t have the permission to run it. Required: `BAN_MEMBERS`')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		if (!interaction.member.permissions.has('BAN_MEMBERS')) return await interaction.reply({ embeds: [permission] });

		const invalid = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('Unsuccessful execution')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('Invalid user')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		if (!user) return await interaction.reply({ embeds: [invalid] });

		const success = new MessageEmbed()
			.setColor('#028760')
			.setTitle(`Unbanning: ${user.tag} | Executor: ${interaction.user.tag}`)
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription(`Reason: ${reasons}`)
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		await interaction.reply({ embeds: [success] });
		interaction.guild.members.unban(user('「' + reasons + `」by:${interaction.user.tag}`));
	},
};