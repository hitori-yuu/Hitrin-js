const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('そのユーザーの禁止を解除します。')
		.addUserOption(option => option.setName('対象').setDescription('ユーザーを選択'))
		.addStringOption(option => option.setName('理由').setDescription('任意の文字列を入力')),
	async execute(interaction, client) {
		const user = interaction.options.getUser('対象');
		const reasons = interaction.options.getString('理由') || 'None';

		const embed = new MessageEmbed()
			.setColor('#028760')
			.setTitle('ユーザーの禁止を解除(UNBAN)')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription(`**[対象者]** <@${user.id}>\n**[実行者]** <@${interaction.user.id}>\n**[理由]**\n${reasons}`)
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		if (!user) return error_invalid(interaction, client, 'ユーザー');
		if (!guild.bans.fetch(user.id)) return error_invalid(interaction, client, 'ユーザー');
		if (!interaction.member.permissions.has('BAN_MEMBERS')) return error_permission(interaction, client, 'BAN_MEMBERS');

		interaction.guild.bans.remove(user.id, { reason: '「' + reasons + `」by:${interaction.user.tag}` });
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