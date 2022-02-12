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
				{ name: '__**グローバルBAN:**__', value: '危険なユーザーをあらかじめBANしておく機能を設定します。' },
				{ name: '__**自動管理:**__', value: 'サーバー内の様々な管理をボットが自動で行う機能を設定します。__(β機能)__' },
			)
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		await interaction.reply({ embeds: [home], components: [new MessageActionRow().addComponents([nick, announce, welcome, globalban, automod])] });


		// const guildsData = await guildsModel.findOne({ _id: interaction.guild.id });
		// if (!guildsData) {
		// 	const guild = await guildsModel.create({
		// 		_id: interaction.guild.id,
		// 		ownerID: interaction.guild.ownerId,
		// 		welcomeCh: null,
		// 		globalBan: true,
		// 		autoMod: true,
		// 	});
		// 	guild.save();
		// }

		// const permission = new MessageEmbed()
		// 	.setColor('#ba2636')
		// 	.setTitle('実行に失敗')
		// 	.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		// 	.setDescription('あなたは実行に必要な権限を持っていません。')
		// 	.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		// 	.setTimestamp();

		// const error = new MessageEmbed()
		// 	.setColor('#ba2636')
		// 	.setTitle('実行に失敗')
		// 	.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		// 	.setDescription('エラー')
		// 	.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		// 	.setTimestamp();

		// const announce = new MessageEmbed()
		// 	.setColor('#89c3eb')
		// 	.setTitle('Added follower')
		// 	.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		// 	.addFields(
		// 		{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
		// 		{ name: '__**Server:**__', value: `**[Name]** ${interaction.guild.name}\n**[ID]** ${interaction.guild.id}\n**[Owner]** <@${interaction.guild.ownerId}>` },
		// 		{ name: '__**Channel:**__', value: `**[Name]** ${interaction.channel.name}\n**[ID]** ${interaction.channel.id}` },
		// 	)
		// 	.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
		// 	.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		// 	.setTimestamp();

		// if (type === 'string') {
		// 	if (!interaction.member.permissions.has('CHANGE_NICKNAME')) return await interaction.reply({ embeds: [permission] });
		// 	await interaction.guild.me.setNickname(string);
		// 	await interaction.reply('ニックネームを設定しました。 -> **' + string + '**');
		// }
		// else if (type === 'announce') {
		// 	if (!interaction.member.permissions.has('MANAGE_GUILD')) return await interaction.reply({ embeds: [permission] });
		// 	else if (interaction.channel.type == 'GUILD_STORE') return interaction.reply('このチャンネルは設定できません。');
		// 	await client.channels.cache.get('879943806118678528').send({ embeds: [announce] });
		// 	await interaction.reply('このチャンネルでお知らせを受け取ります。');
		// 	client.channels.cache.get('913821026377420910').addFollower(interaction.channel.id);
		// }
		// else if (type === 'welcome') {
		// 	if (!interaction.member.permissions.has('MANAGE_GUILD')) return await interaction.reply({ embeds: [permission] });
		// 	const guild = await guildsModel.findOneAndUpdate(
		// 		{
		// 			_id: interaction.guild.id,
		// 		},
		// 		{
		// 			$set: {
		// 				welcomeCh: channel.id,
		// 			},
		// 		},
		// 	);
		// 	guild.save();
		// 	await interaction.reply(`\`${channel.name}\` を加入お知らせ用のチャンネルに設定しました。`);
		// }
		// else if (type === 'globalban') {
		// 	if (!interaction.member.permissions.has('MANAGE_GUILD')) {return await interaction.reply({ embeds: [permission] });}
		// 	else if (discrimination === 'approval') {
		// 		const guild = await guildsModel.findOneAndUpdate(
		// 			{
		// 				_id: interaction.guild.id,
		// 			},
		// 			{
		// 				$set: {
		// 					globalBan: true,
		// 				},
		// 			},
		// 		);
		// 		guild.save();
		// 		const { _id } = await guildsModel.find();
		// 		for (const user of _id) {
		// 			interaction.guild.bans.create(user, { reason: 'HitorinGlobalBAN「' + string + '」', days: '7' });
		// 		}
		// 	}
		// 	else if (discrimination === 'disapproval') {
		// 		const guild = await guildsModel.findOneAndUpdate(
		// 			{
		// 				_id: interaction.guild.id,
		// 			},
		// 			{
		// 				$set: {
		// 					globalBan: false,
		// 				},
		// 			},
		// 		);
		// 		guild.save();
		// 	}
		// 	else {
		// 		return await interaction.reply({ embeds: [error] });
		// 	}
		// 	await interaction.reply(`グローバルBANを設定しました -> ${discrimination}`);
		// }
		// else if (type === 'automod') {
		// 	if (!interaction.member.permissions.has('MANAGE_GUILD')) {return await interaction.reply({ embeds: [permission] });}
		// 	else if (discrimination === 'approval') {
			// 	const guild = await guildsModel.findOneAndUpdate(
			// 		{
			// 			_id: interaction.guild.id,
			// 		},
			// 		{
			// 			$set: {
			// 				autoMod: true,
			// 			},
			// 		},
			// 	);
			// 	guild.save();
			// }
		// 	else if (discrimination === 'disapproval') {
		// 		const guild = await guildsModel.findOneAndUpdate(
		// 			{
		// 				_id: interaction.guild.id,
		// 			},
		// 			{
		// 				$set: {
		// 					autoMod: false,
		// 				},
		// 			},
		// 		);
		// 		guild.save();
		// 	}
		// 	else {
		// 		return await interaction.reply({ embeds: [error] });
		// 	}
		// 	await interaction.reply(`自動管理を設定しました -> ${discrimination}`);
		// }
		// else if (type === 'status') {
		// 	const guild = await guildsModel.findOne({ _id: interaction.guild.id });
		// 	let welcomech;
		// 	if (guild.welcomeCh) welcomech = interaction.guild.channels.cache.get(guild.welcomeCh);
		// 	if (!guild.welcomeCh) welcomech = '❌None❌';
		// 	let autoMod = '許可';
		// 	if (!guild.autoMod) autoMod = '禁止';
		// 	const embed = new MessageEmbed()
		// 		.setColor('#89c3eb')
		// 		.setTitle('このサーバーの設定の一覧')
		// 		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		// 		.setDescription(`加入お知らせ: \`${welcomech.name || '❌None❌'}\`\n自動管理: \`${autoMod || '❌None❌'}\``)
		// 		.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
		// 		.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		// 		.setTimestamp();
		// 	await interaction.reply({ embeds: [embed] });
		// }
		// else {
		// 	return await interaction.reply({ embeds: [error] });
		// }
	},
};