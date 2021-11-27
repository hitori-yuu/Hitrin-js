const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('そのユーザーの禁止を解除します。')
		.addUserOption(option => option.setName('対象').setDescription('ユーザーを選択'))
		.addStringOption(option => option.setName('理由').setDescription('任意の文字列を入力')),
	async execute(interaction, client) {
		const user = interaction.options.getUser('対象');
		const reasons = interaction.options.getString('理由') || 'None';

		const permission = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('あなたは実行に必要な権限を持っていません。 実行に必要な権限： `BAN_MEMBERS`')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		const invalid = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('存在しないユーザー')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		const success = new MessageEmbed()
			.setColor('#028760')
			.setTitle('ユーザーの禁止を解除(UNBAN)')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription(`**[対象者]** <@${user.id}>\n**[実行者]** <@${interaction.user.id}>\n**[理由]**\n${reasons}`)
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		if (!user) {
			return await interaction.reply({ embeds: [invalid] });
		}
		else if (!interaction.member.permissions.has('BAN_MEMBERS')) {
			return await interaction.reply({ embeds: [permission] });
		}
		else {
			interaction.guild.bans.remove(user.id, { reason: '「' + reasons + `」by:${interaction.user.tag}` });
			await interaction.reply({ embeds: [success] });
		}
	},
};