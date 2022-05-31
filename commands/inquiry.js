const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inquiry')
		.setDescription('運営に依頼や質問等を送信します。')
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('依頼', 'request').addChoice('質問', 'question').addChoice('不具合', 'bug').addChoice('報告', 'report').setRequired(true))
		.addStringOption(option => option.setName('内容').setDescription('任意の文字列を入力').setRequired(true))
		.addUserOption(option => option.setName('対象').setDescription('ユーザーを選択')),
	async execute(interaction, client) {
		const type = interaction.options.getString('種類');
		const body = interaction.options.getString('内容') || 'None';
		const target = interaction.options.getUser('対象');

		if (type === 'request') t = '依頼';
		else if (type === 'question') t = '質問';
		else if (type === 'bug') t = '不具合';

		if (!type === 'report') {
			const success_1 = new MessageEmbed()
				.setColor('#028760')
				.setTitle('送信完了')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.setDescription(`**[種類]** ${t}\n**[内容]** ${body}`)
				.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			const in_1 = new MessageEmbed()
				.setColor('#f5e56b')
				.setTitle(`Inquiry [${t}]`)
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.addFields(
					{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
					{ name: '__**Body:**__', value: `${body}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();

			await interaction.reply({ embeds: [success_1] });
			client.channels.cache.get('912561215669149717').send({ embeds: [in_1] });
		}

		if (type === 'report') {
			const success_2 = new MessageEmbed()
				.setColor('#028760')
				.setTitle('送信完了')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.setDescription(`**[種類]** レポート\n**[内容]** ${body}\n**[対象]** <@${target.id}>`)
				.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			const in_2 = new MessageEmbed()
				.setColor('#f5e56b')
				.setTitle('Inquiry [Report]')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.addFields(
					{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
					{ name: '__**Target:**__', value: `**[Name]** ${target.tag}\n**[ID]** ${target.id}\n**[Mention]** <@${target.id}>` },
					{ name: '__**Body:**__', value: `${body}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();

			if (!target) return error_invalid(interaction, client, '対象')
			await interaction.reply({ embeds: [success_2] });
			client.channels.cache.get('912561215669149717').send({ embeds: [in_2] });
		}
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