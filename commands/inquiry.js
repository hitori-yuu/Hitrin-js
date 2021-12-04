const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inquiry')
		.setDescription('運営に依頼や質問等を送信します。')
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('依頼', 'request').addChoice('質問', 'question').addChoice('不具合', 'bug').addChoice('報告', 'report'))
		.addStringOption(option => option.setName('内容').setDescription('任意の文字列を入力'))
		.addUserOption(option => option.setName('対象').setDescription('ユーザーを選択')),
	async execute(interaction, client) {
		const type = interaction.options.getString('種類');
		const body = interaction.options.getString('内容') || 'None';
		if (!type === 'report') {
			let t = type;
			if (t === 'request') t = '依頼';
			if (t === 'question') t = '質問';
			if (t === 'bug') t = '不具合';
			const success_1 = new MessageEmbed()
				.setColor('#028760')
				.setTitle('送信完了')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.setDescription(`**[種類]** ${t}\n**[内容]** ${body}`)
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			const in_1 = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle(`Inquiry [${t}]`)
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
					{ name: '__**Body:**__', value: `${body}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [success_1] });
			await client.channels.cache.get('912561215669149717').send({ embeds: [in_1] });
		}
		else if (type === 'r') {
			const target = interaction.options.getUser('target');
			const success_2 = new MessageEmbed()
				.setColor('#028760')
				.setTitle('送信完了')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.setDescription(`**[種類]** レポート\n**[内容]** ${body}\n**[対象]** <@${target.id}>`)
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			const in_2 = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('Inquiry [Report]')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
					{ name: '__**Target:**__', value: `**[Name]** ${target.tag}\n**[ID]** ${target.id}\n**[Mention]** <@${target.id}>` },
					{ name: '__**Body:**__', value: `${body}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [success_2] });
			await client.channels.cache.get('912561215669149717').send({ embeds: [in_2] });
		}
	},
};