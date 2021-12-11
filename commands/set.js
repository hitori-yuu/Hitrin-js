const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const guildsModel = require('../models/guildsSchema');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('BOTに関することを設定します。')
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('ニックネーム', 'string').addChoice('お知らせ', 'announce').addChoice('サーバー', 'server').addChoice('加入お知らせ', 'welcome').addChoice('グローバルBAN', 'globalban').addChoice('現在の状態', 'status'))
		.addStringOption(option => option.setName('文字').setDescription('任意の文字列を入力'))
		.addStringOption(option => option.setName('設定').setDescription('「許可」か「禁止」のどちらかを選択').addChoice('許可', 'approval').addChoice('禁止', 'disapproval'))
		.addChannelOption(option => option.setName('チャンネル').setDescription('任意のチャンネルを選択')),
	async execute(interaction, client) {
		const type = interaction.options.getString('種類');
		const discrimination = interaction.options.getString('設定');
		const channel = interaction.options.getChannel('チャンネル');
		let string = interaction.options.getString('文字');
		if (string == 'none' || null) string = 'ヒトリン';

		const permission = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('あなたは実行に必要な権限を持っていません。')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		const error = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('エラー')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		const announce = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('Added follower')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.addFields(
				{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
				{ name: '__**Server:**__', value: `**[Name]** ${interaction.guild.name}\n**[ID]** ${interaction.guild.id}\n**[Owner]** <@${interaction.guild.ownerId}>` },
				{ name: '__**Channel:**__', value: `**[Name]** ${interaction.channel.name}\n**[ID]** ${interaction.channel.id}` },
			)
			.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		if (type === 'string') {
			if (!interaction.member.permissions.has('CHANGE_NICKNAME')) return await interaction.reply({ embeds: [permission] });
			await interaction.guild.me.setNickname(string);
			await interaction.reply('ニックネームを設定しました。 -> **' + string + '**');
		}
		else if (type === 'announce') {
			if (!interaction.member.permissions.has('MANAGE_GUILD')) return await interaction.reply({ embeds: [permission] });
			else if (interaction.channel.type == 'GUILD_STORE') return interaction.reply('このチャンネルは設定できません。');
			await client.channels.cache.get('879943806118678528').send({ embeds: [announce] });
			await interaction.reply('このチャンネルでお知らせを受け取ります。');
			client.channels.cache.get('913821026377420910').addFollower(interaction.channel.id);
		}
		else if (type === 'welcome') {
			if (!interaction.member.permissions.has('MANAGE_GUILD')) return await interaction.reply({ embeds: [permission] });
			const guild = await guildsModel.findOneAndUpdate(
				{
					_id: interaction.guild.id,
				},
				{
					$set: {
						welcomeCh: channel.id,
					},
				},
			);
			guild.save();
			await interaction.reply(`\`${channel.name}\` を加入お知らせ用のチャンネルに設定しました。`);
		}
		else if (type === 'globalban') {
			if (!interaction.member.permissions.has('MANAGE_GUILD')) {return await interaction.reply({ embeds: [permission] });}
			else if (discrimination === 'approval') {
				const guild = await guildsModel.findOneAndUpdate(
					{
						_id: interaction.guild.id,
					},
					{
						$set: {
							globalBan: true,
						},
					},
				);
				guild.save();
				const { _id } = await guildsModel.find();
				for (const user of _id) {
					interaction.guild.bans.create(user, { reason: 'HitorinGlobalBAN「' + string + '」', days: '7' });
				}
			}
			else if (discrimination === 'disapproval') {
				const guild = await guildsModel.findOneAndUpdate(
					{
						_id: interaction.guild.id,
					},
					{
						$set: {
							globalBan: false,
						},
					},
				);
				guild.save();
			}
			else {
				return await interaction.reply({ embeds: [error] });
			}
			await interaction.reply(`グローバルBANを設定しました -> ${discrimination}`);
		}
		else if (type === 'status') {
			const guild = await guildsModel.findOne({ _id: interaction.guild.id });
			const welcomech = interaction.guild.channels.cache.get(guild.welcomeCh);
			const embed = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('このサーバーの設定の一覧')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.setDescription(`加入お知らせ： \`${welcomech.name || '❌None❌'}\``)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });
		}
		else {
			return await interaction.reply({ embeds: [error] });
		}
	},
};