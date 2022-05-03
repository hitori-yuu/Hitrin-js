const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('そのメンバーをサーバーから追放します。')
		.addUserOption(option => option.setName('対象').setDescription('メンバーを選択').setRequired(true))
		.addStringOption(option => option.setName('理由').setDescription('任意の文字列を入力')),
	async execute(interaction, client) {
		const member = interaction.options.getMember('対象');
		const reasons = interaction.options.getString('理由') || 'None';

		const embed = new MessageEmbed()
			.setColor('#028760')
			.setTitle('メンバーを追放(KICK)')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription(`**[対象者]** <@${member.id}>\n**[実行者]** <@${interaction.user.id}>\n**[理由]**\n${reasons}`)
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		if (!member) return error_invalid(interaction, client, 'メンバー');
		if (interaction.guild.ownerId !== interaction.user.id && member.roles.highest.comparePositionTo(interaction.member.roles.highest) >= 0) return error_invalid(interaction, client, 'メンバー');
		if (!member.kickable) return error_invalid(interaction, client, 'メンバー');
		else if (!interaction.member.permissions.has('KICK_MEMBERS')) return error_permission(interaction, client, 'KICK_MEMBERS');

		member.kick({ reason: '「' + reasons + `」by:${interaction.user.tag}` });
		await interaction.reply({ embeds: [embed] });
	},
};

function error_invalid(interaction, client, invalid) {
	const error = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription(`実行に必須なパラメータが無効です: \`${invalid || 'None'}\``)
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	return interaction.reply({ embeds: [error] });
}
function error_permission(interaction, client, permission) {
	const error = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription(`実行に必須な権限がありません: \`${permission || 'None'}\``)
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	return interaction.reply({ embeds: [error] });
}