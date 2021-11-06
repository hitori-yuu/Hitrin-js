const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban the user from the server.')
		.addUserOption(option => option.setName('target').setDescription('The user ※only either the __user__ or the __user ID__.'))
		.addStringOption(option => option.setName('targetid').setDescription('The user ID ※only either the __user__ or the __user ID__.'))
		.addStringOption(option => option.setName('reason').setDescription('The reason'))
		.addNumberOption(option => option.setName('days').setDescription('The days')),
	async execute(interaction, client) {
		const user = interaction.options.getUser('target') || interaction.options.getString('targetid');
		const reasons = interaction.options.getString('reason') || 'None';
		const day = interaction.options.getNumber('days') || '';

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
			.setTitle(`Banned: ${user.tag} | Executor: ${interaction.user.tag}`)
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription(`Reason: ${reasons}`)
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		await interaction.reply({ embeds: [success] });

		if (interaction.options.getUser('target') || interaction.options.getString('targetid')) {
			if (interaction.options.getUser('target')) {
				user.ban({ reason: '「' + reasons + `」by:${interaction.user.tag}`, days: day });
			}
			if (interaction.options.getString('targetid')) {
				client.cache.get(user).ban({ reason: '「' + reasons + `」by:${interaction.user.tag}`, days: day });
			}
		}

		if (interaction.options.getUser('target') && interaction.options.getString('targetid')) {
			await interaction.reply('Sorry, Specify **only either** the __user__ or the __user ID__.');
		}
	},
};