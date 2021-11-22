const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-nick')
		.setDescription('Set the nickname of the BOT.')
		.addStringOption(option => option.setName('nickname').setDescription('The nickname')),
	async execute(interaction, client) {
		let nick = interaction.options.getString('nickname');
		if (nick == 'none' || null) nick = 'ヒトリン';
		const permission = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('Unsuccessful execution')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('You don\'t have the permission to run it. Required: `CHANGE_NICKNAME`')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		if (!interaction.member.permissions.has('CHANGE_NICKNAME')) return await interaction.reply({ embeds: [permission] });
		await interaction.guild.me.setNickname(nick);
		await interaction.reply('Nickname has been set -> **' + nick + '**');
	},
};