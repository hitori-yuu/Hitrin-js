const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const gbanModel = require('../models/globalbansSchema');
const profileModel = require('../models/profileSchema');
const guildsModel = require('../models/guildsSchema');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('manage')
		.setDescription('ボットの管理コマンド。※ボット管理者のみ実行可能')
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('コイン', 'coin').addChoice('評価値', 'evaluation').addChoice('ボットの名前', 'bot').addChoice('グローバルBAN', 'g-ban'))
		.addStringOption(option => option.setName('変更の種類').setDescription('種類を選択').addChoice('設定', 'set').addChoice('加増', 'increase').addChoice('減少', 'decrease').addChoice('追加', 'addition').addChoice('削除', 'deletion').addChoice('ユーザーネーム', 'username').addChoice('アバター', 'avatar'))
		.addUserOption(option => option.setName('ユーザー').setDescription('ユーザーを選択'))
		.addStringOption(option => option.setName('文字列').setDescription('任意の文字列を入力'))
		.addNumberOption(option => option.setName('数値').setDescription('任意の数値を入力')),
	async execute(interaction, client) {
		if (!interaction.user.id === '874184214130602015') return;
		const type = interaction.options.getString('種類');
		const change = interaction.options.getString('変更の種類');
		const user = interaction.options.getUser('ユーザー');
		const string = interaction.options.getString('文字列');
		const number = interaction.options.getNumber('数値');
		let mark = '';
		if (change === 'increase') mark = '+';
		if (change === 'decrease') mark = '-';

		const error = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('その種類は選択できません。')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		if (type === 'coin') {
			const coin = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('ボット管理')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**Target:**__', value: `**[Name]** ${user.tag}\n**[ID]** ${user.id}\n**[Mention]** <@${user.id}>` },
					{ name: '__**Body:**__', value: `**[Coins]** Changed the coin: ${mark}${number} *coins*` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			if (change === 'set') {
				await interaction.reply({ embeds: [coin] });
				const profile = await profileModel.findOneAndUpdate(
					{
						_id: user.id,
					},
					{
						$set: {
							coins: number,
						},
					},
				);
				profile.save();
			}
			else if (change === 'increase') {
				await interaction.reply({ embeds: [coin] });
				const profile = await profileModel.findOneAndUpdate(
					{
						_id: user.id,
					},
					{
						$inc: {
							coins: number,
						},
					},
				);
				profile.save();
			}
			else if (change === 'decrease') {
				await interaction.reply({ embeds: [coin] });
				const profile = await profileModel.findOneAndUpdate(
					{
						_id: user.id,
					},
					{
						$inc: {
							coins: -number,
						},
					},
				);
				profile.save();
			}
			else {
				return await interaction.reply({ embeds: [error] });
			}
		}
		else if (type === 'evaluation') {
			const evaluation = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('ボット管理')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**Target:**__', value: `**[Name]** ${user.tag}\n**[ID]** ${user.id}\n**[Mention]** <@${user.id}>` },
					{ name: '__**Body:**__', value: `**[Evaluation]** Changed the evaluation value: ${mark}${number}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			if (change === 'set') {
				await interaction.reply({ embeds: [evaluation] });
				const profile = await profileModel.findOneAndUpdate(
					{
						_id: user.id,
					},
					{
						$set: {
							evaluation: number,
						},
					},
				);
				profile.save();
			}
			else if (change === 'increase') {
				await interaction.reply({ embeds: [evaluation] });
				const profile = await profileModel.findOneAndUpdate(
					{
						_id: user.id,
					},
					{
						$inc: {
							evaluation: number,
						},
					},
				);
				profile.save();
			}
			else if (change === 'decrease') {
				await interaction.reply({ embeds: [evaluation] });
				const profile = await profileModel.findOneAndUpdate(
					{
						_id: user.id,
					},
					{
						$inc: {
							evaluation: -number,
						},
					},
				);
				profile.save();
			}
			else {
				return await interaction.reply({ embeds: [error] });
			}
		}
		else if (type === 'bot') {
			let change_type = 'Username';
			if (change === 'avatar') change_type = 'Avatar';
			const bot = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('ボット管理')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**Target:**__', value: `**[Name]** ${user.tag}\n**[ID]** ${user.id}\n**[Mention]** <@${user.id}>` },
					{ name: '__**Body:**__', value: `**[${change_type}]** Changed: ${string}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			if (change === 'username') {
				await client.user.setUsername(string).then(
					interaction.reply({ embeds: [bot] }),
				);
			}
			if (change === 'avatar') {
				await client.user.setAvatar(string).then(
					interaction.reply({ embeds: [bot] }),
				);
			}
			else {
				return await interaction.reply({ embeds: [error] });
			}
		}
		else if (type === 'g-ban') {
			let global_ban = 'Added';
			if (change === 'deletion') global_ban = 'Removed';
			const g_ban = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('ボット管理')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**Target:**__', value: `**[Name]** ${user.tag}\n**[ID]** ${user.id}\n**[Mention]** <@${user.id}>` },
					{ name: '__**Body:**__', value: `**[GlobalBan]** ${global_ban}: ${user.tag}\n**[Reason]**\n${string}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			if (change === 'addition') {
				const gbanData = await gbanModel.findOne({ _id: user.id });
				if (gbanData) {
					await interaction.reply('そのユーザーは既にGlobalBanされています。');
				}
				else if (!gbanData) {
					const gban = new gbanModel({
						_id: user.id,
						reason: string,
						date: new Date(),
					});
					gban.save();

					client.guilds.cache.forEach((guild) => {
						const guildsData = guildsModel.findOne({ _id: interaction.guild.id });
						if (guildsData.globalBan === true) {
							guild.bans.create(user, { reason: 'HitorinGlobalBAN「' + string + '」', days: '7' });
						}
						else {return;}
					});
					await interaction.reply({ embeds: [g_ban] });
				}
			}
			if (change === 'deletion') {
				const gbanData = await gbanModel.findOne({ _id: user.id });
				if (gbanData) {
					gbanData.remove();
					client.guilds.cache.forEach((guild) => {
						try {
							guild.bans.remove(user, { reason: 'HitorinGlobalBAN(REMOVE)「' + string + '」' });
						}
						catch (err) {
							return console.log(err);
						}
					});
					await interaction.reply({ embeds: [g_ban] });
				}
				else if (!gbanData) {
					await interaction.reply('そのユーザーはGlobalBanされていません。');
				}
			}
		}
	},
};