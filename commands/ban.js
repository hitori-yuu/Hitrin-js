const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('そのメンバーをサーバーから禁止します。')
		.addUserOption(option => option.setName('対象').setDescription('メンバーを選択'))
		.addStringOption(option => option.setName('理由').setDescription('任意の文字列を入力'))
		.addStringOption(option => option.setName('メッセージ削除').setDescription('メッセージ履歴の削除期間を選択').addChoice('削除しない', '0').addChoice('過去24時間', '1').addChoice('過去7日', '7')),
	async execute(interaction, client) {
		const user = interaction.options.getMember('対象');
		const reasons = interaction.options.getString('理由') || 'None';
		const messages = interaction.options.getString('削除') || '0';

		const permission = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('あなたは実行に必要な権限を持っていません。 実行に必要な権限: `BAN_MEMBERS`')
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		const invalid = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('存在しないメンバー')
			.setFooter.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		const success = new MessageEmbed()
			.setColor('#028760')
			.setTitle('メンバーを禁止(BAN)')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription(`**[対象者]** <@${user.id}>\n**[実行者]** <@${interaction.user.id}>\n**[理由]**\n${reasons}`)
			.setFooter.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		if (!user) {
			return await interaction.reply({ embeds: [invalid] });
		}
		else if (!interaction.member.permissions.has('BAN_MEMBERS')) {
			return await interaction.reply({ embeds: [permission] });
		}
		else {
			user.ban({ reason: '「' + reasons + `」by:${interaction.user.tag}`, days: messages });
			await interaction.reply({ embeds: [success] });
		}
	},
};