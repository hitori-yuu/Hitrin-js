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
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('コイン', 'coin').addChoice('評価値', 'evaluation').addChoice('ボットの名前', 'bot').addChoice('グローバルBAN', 'g-ban').addChoice('シャットダウン', 'shutdown').setRequired(true))
		.addStringOption(option => option.setName('パスワード').setDescription('パスワードを入力').setRequired(true))
		.addStringOption(option => option.setName('変更の種類').setDescription('種類を選択').addChoice('設定', 'set').addChoice('加増', 'increase').addChoice('減少', 'decrease').addChoice('追加', 'addition').addChoice('削除', 'deletion').addChoice('ユーザーネーム', 'username').addChoice('アバター', 'avatar').setRequired(true))
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
		const password = interaction.options.getString('パスワード') || '0';
		let mark = '';
		if (change === 'increase') mark = '+';
		if (change === 'decrease') mark = '-';

		const error = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('その種類は選択できません。')
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		if (password === process.env.PASSWORD) {
			if (type === 'coin') {
				const coin = new MessageEmbed()
					.setColor('#89c3eb')
					.setTitle('ボット管理')
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.addFields(
						{ name: '__**Target:**__', value: `**[Name]** ${user.tag}\n**[ID]** ${user.id}\n**[Mention]** <@${user.id}>` },
						{ name: '__**Body:**__', value: `**[Coins]** Changed the coin: ${mark}${number} *coins*` },
					)
					.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
					.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
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
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.addFields(
						{ name: '__**Target:**__', value: `**[Name]** ${user.tag}\n**[ID]** ${user.id}\n**[Mention]** <@${user.id}>` },
						{ name: '__**Body:**__', value: `**[Evaluation]** Changed the evaluation value: ${mark}${number}` },
					)
					.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
					.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
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
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.addFields(
						{ name: '__**Target:**__', value: `**[Name]** ${user.tag}\n**[ID]** ${user.id}\n**[Mention]** <@${user.id}>` },
						{ name: '__**Body:**__', value: `**[${change_type}]** Changed: ${string}` },
					)
					.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
					.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
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
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.addFields(
						{ name: '__**Target:**__', value: `**[Name]** ${user.tag}\n**[ID]** ${user.id}\n**[Mention]** <@${user.id}>` },
						{ name: '__**Body:**__', value: `**[GlobalBan]** ${global_ban}: ${user.tag}\n**[Reason]**\n${string}` },
					)
					.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
					.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
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

						client.guilds.cache.forEach(async (guild) => {
							const guildsData = await guildsModel.findOne({ _id: guild.id });
							try {
								if (!guildsData) return;
								if (guildsData.settings.globalBan === false) return;
								if (!guild.me.permissions.has('BAN_MEMBERS')) return;

								const g_ban_log = new MessageEmbed()
									.setColor('#89c3eb')
									.setTitle('ボット管理')
									.setDescription(`${guild.name}(${guild.id}) にて ${user.tag}(${user.id}) をGlobalBanしました。`)
									.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
									.setTimestamp();
								client.channels.cache.get('879943806118678528').send({ embeds: [g_ban_log] });
								guild.bans.create(user, { reason: 'HitrinGlobalBAN「' + string + '」', days: '7' });
							} catch(e) {
								return console.log('[異常]\n'+ guild.name + e);
							}
						});
						await interaction.reply({ embeds: [g_ban] });
					}
				}
				if (change === 'deletion') {
					const gbanData = await gbanModel.findOne({ _id: user.id });
					if (!gbanData) {
						await interaction.reply('そのユーザーはGlobalBanされていません。');
					}
					else if (gbanData) {
						gbanData.remove();
						client.guilds.cache.forEach(async (guild) => {
							try {
								const guildsData = await guildsModel.findOne({ _id: guild.id });
								if (guildsData.settings.globalBan === false) return;

								guild.bans.remove(user, { reason: 'HitrinGlobalBAN(REMOVE)「' + string + '」' });
								const g_ban_log = new MessageEmbed()
									.setColor('#89c3eb')
									.setTitle('ボット管理')
									.setDescription(`${guild.name}(${guild.id}) にて ${user.tag}(${user.id}) のGlobalBanを解除しました。`)
									.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
									.setTimestamp();
								client.channels.cache.get('879943806118678528').send({ embeds: [g_ban_log] });
							} catch(e) {
								return console.log('[異常]\n'+ guild.name + e);
							}
						})
						await interaction.reply({ embeds: [g_ban] });
					}
				}
				else {
					return await interaction.reply({ embeds: [error] });
				}
			}
			if (type === 'shutdown') {
				if (change === 'set') {
					await interaction.reply('シャットダウンします。');

					setTimeout(() => {
						process.exit();
					}, 2000)
				}
				else {
					return await interaction.reply({ embeds: [error] });
				}
			}
		} else {
			return interaction.reply('無効なパスワードです。')
		}
	},
};