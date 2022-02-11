/* eslint-disable no-shadow */
/* eslint-disable no-redeclare */
/* eslint-disable no-var */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const weather = require('weather-js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('天気を表示')
		.addStringOption(option => option.setName('地名').setDescription('任意の文字列を入力'))
		.addStringOption(option => option.setName('日付').setDescription('日付を選択').addChoice('今日', 'today').addChoice('明日', 'tomorrow'))
		.addStringOption(option => option.setName('温度の種類').setDescription('種類を選択').addChoice('摂氏℃', 'C').addChoice('華氏℉', 'F')),
	async execute(interaction, client) {
		const location = interaction.options.getString('地名');
		const type = interaction.options.getString('日付') || 'today';
		const type_2 = interaction.options.getString('温度の種類') || 'C';
		let mark = '℃';
		if (type_2 == 'F') mark = '℉';
		weather.find({ search: location, degreeType: type_2 }, function(err, result) {
			if (err) {return;}
			const current = result[0].current;
			const location = result[0].location;
			const tomorrow = result[0].forecast[1];
			var to = current;
			if (type === 'tomorrow') to = tomorrow;

			switch (current.skytext || tomorrow.skytextday) {
			case 'Mostly Sunny':
				var skytext = 'ほぼ晴れ';
				break;
			case 'Cloudy' :
				var skytext = '曇り';
				break;
			case 'Partly Cloudy':
				var skytext = '晴れのち曇り';
				break;
			case 'Sunny':
				var skytext = '晴れ';
				break;
			case 'Clear' :
				var skytext = '雲1つない快晴';
				break;
			case 'Mostly Clear':
				var skytext = 'ほぼ快晴';
				break;
			case 'Mostly Cloudy':
				var skytext = 'ほぼ曇り';
				break;
			case 'Partly Sunny':
				var skytext = '所により晴れ';
				break;
			case 'Light Rain':
				var skytext = '小雨';
				break;
			default:
				var skytext = current.skytext;
				break;
			}
			switch (to.day) {
			case 'Monday':
				var day = '月曜日';
				break;
			case 'Tuesday':
				var day = '火曜日';
				break;
			case 'Wednesday':
				var day = '水曜日';
				break;
			case 'Thursday':
				var day = '木曜日';
				break;
			case 'Friday':
				var day = '金曜日';
				break;
			case 'Saturday':
				var day = '土曜日';
				break;
			case 'Sunday':
				var day = '日曜日';
				break;
			default:
				var day = to.day;
				break;
			}
			if (type === 'today') {
				const embed = new MessageEmbed()
					.setColor('#89c3eb')
					.setTitle(`${location.name}の天気`)
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.addFields(
						{ name: '__**一般:**__', value: `**[天気]** ${skytext}\n**[湿度]** ${current.humidity}%\n**[風]** ${current.winddisplay}` },
						{ name: '__**気温:**__', value: `**[気温]** ${current.temperature + mark}\n**[体感]** ${current.feelslike + mark}` },
						{ name: '__**時間:**__', value: `**[日付]** ${current.date} ${day}\n**[最終更新]**${current.observationtime}` },
					)
					.setThumbnail(current.imageUrl)
					.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
					.setTimestamp();
				interaction.reply({ embeds: [embed] });
			}
			else if (type === 'tomorrow') {
				const embed = new MessageEmbed()
					.setColor('#89c3eb')
					.setTitle(`${location.name}の天気`)
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.addFields(
						{ name: '__**一般:**__', value: `**[天気]** ${skytext}\n**[降水量]** ${tomorrow.precip || 'None'}` },
						{ name: '__**気温:**__', value: `**[最高]** ${tomorrow.high + mark}\n**[最低]** ${tomorrow.low + mark}` },
						{ name: '__**時間:**__', value: `**[日付]** ${tomorrow.date} ${day}` },
					)
					.setThumbnail(location.imagerelativeurl)
					.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
					.setTimestamp();
				interaction.reply({ embeds: [embed] });
			}
		});
	},
};

