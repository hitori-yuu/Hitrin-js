const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('そのメンバーをサーバーから追放します。')
		.addUserOption(option => option.setName('対象').setDescription('メンバーを選択'))
		.addStringOption(option => option.setName('理由').setDescription('任意の文字列を入力')),
	async execute(interaction, client) {
		const user = interaction.options.getMember('対象');
		const reasons = interaction.options.getString('理由') || 'None';

		const permission = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('あなたは実行に必要な権限を持っていません。 実行に必要な権限： `KICK_MEMBERS`')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		const invalid = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('存在しないメンバー')
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		const success = new MessageEmbed()
			.setColor('#028760')
			.setTitle('メンバーを追放(KICK)')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription(`**[対象者]** <@${user.id}>\n**[実行者]** <@${interaction.user.id}>\n**[理由]**\n${reasons}`)
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		if (!user) {
			return await interaction.reply({ embeds: [invalid] });
		}
		else if (!interaction.member.permissions.has('KICK_MEMBERS')) {
			return await interaction.reply({ embeds: [permission] });
		}
		else {
			user.kick({ reason: '「' + reasons + `」by:${interaction.user.tag}` });
			await interaction.reply({ embeds: [success] });
		}
	},
};