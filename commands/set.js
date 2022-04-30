const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('BOTに関することを設定します。'),
	async execute(interaction, client) {
		const nick = new MessageButton()
			.setCustomId('nick')
			.setStyle('PRIMARY')
			.setLabel('ニックネーム');
		const announce = new MessageButton()
			.setCustomId('announce')
			.setStyle('PRIMARY')
			.setLabel('お知らせ');
		const welcome = new MessageButton()
			.setCustomId('welcome')
			.setStyle('PRIMARY')
			.setLabel('新規参加');
		const globalban = new MessageButton()
			.setCustomId('globalban')
			.setStyle('PRIMARY')
			.setLabel('グローバルBAN');
		const automod = new MessageButton()
			.setCustomId('automod')
			.setStyle('PRIMARY')
			.setLabel('自動管理');
		const home = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('設定')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('ボットに関する設定を行います。設定したい項目を以下の6つのボタンをクリックし設定してください。')
			.addFields(
				{ name: '__**ニックネーム:**__', value: 'ボットのニックネームを設定します。' },
				{ name: '__**お知らせ:**__', value: 'ボットのアップデートなどのお知らせを受け取るチャンネルを設定します。' },
				{ name: '__**新規参加:**__', value: 'サーバーに新たなユーザーが参加した際に歓迎のメッセージを送信するチャンネルを設定します。' },
				{ name: '__**グローバルBAN:**__', value: '危険なユーザーをあらかじめBANしておく機能を設定します。__(β機能)__' },
				{ name: '__**自動管理:**__', value: 'サーバー内の様々な管理をボットが自動で行う機能を設定します。__(β機能)__' },
			)
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const permission = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('あなたは実行に必要な権限を持っていません。 実行に必要な権限: `MANAGE_GUILD`')
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		if (!interaction.member.permissions.has('MANAGE_GUILD')) {
				return await interaction.reply({ embeds: [permission] });
		}
		await interaction.reply({ embeds: [home], components: [new MessageActionRow().addComponents([nick, announce, welcome, globalban, automod])] });
	},
};