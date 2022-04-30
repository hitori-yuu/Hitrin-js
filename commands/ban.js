const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('そのメンバーをサーバーから禁止します。')
		.addUserOption(option => option.setName('対象').setDescription('メンバーを選択').setRequired(true))
		.addStringOption(option => option.setName('理由').setDescription('任意の文字列を入力'))
		.addStringOption(option => option.setName('メッセージ削除').setDescription('メッセージ履歴の削除期間を選択').addChoice('削除しない', '0').addChoice('過去24時間', '1').addChoice('過去7日', '7')),
	async execute(interaction, client) {
		const user = interaction.options.getUser('対象');
		const reasons = interaction.options.getString('理由') || 'None';
		const messages = interaction.options.getString('削除') || '0';

		const embed = new MessageEmbed()
			.setColor('#028760')
			.setTitle('メンバーを禁止(BAN)')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription(`**[対象者]** <@${user.id}>\n**[実行者]** <@${interaction.user.id}>\n**[理由]**\n${reasons}`)
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		if (!user) return error_invalid(interaction, client, 'ユーザー');
		if (!user.bannable) return error_invalid(interaction, client, 'ユーザー');
		if (!interaction.member.permissions.has('BAN_MEMBERS')) return error_permission(interaction, client, 'BAN_MEMBERS');

		interaction.guild.bans.create(user.id, { reason: '「' + reasons + `」by:${interaction.user.tag}`, days: messages });
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