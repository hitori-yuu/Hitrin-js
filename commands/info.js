const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
const version = process.env.VERSION;
const profileModel = require('../models/profileSchema');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('指定したものの詳細を表示します。')
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('絵文字', 'Emoji').addChoice('ユーザー', 'User').addChoice('メンバー', 'Member').addChoice('サーバー', 'Server').setRequired(true))
		.addUserOption(option => option.setName('対象').setDescription('ユーザーかメンバーを選択'))
		.addStringOption(option => option.setName('絵文字').setDescription('絵文字IDを入力')),
	async execute(interaction, client) {
		const type = interaction.options.getString('種類');
		const user = interaction.options.getUser('対象');
		const member = interaction.options.getMember('対象');
		const emoji = interaction.guild.emojis.cache.find(emoji => emoji.id === interaction.options.getString('絵文字'));
		const server = interaction.guild;
		const members = await interaction.guild.members.fetch();
		let coins;
		let evaluation;
		let mark;
		let bot = '<:bot:957073326520533033> ボット';

		if (type === 'Server') {
			const s = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('サーバーの詳細')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.addFields(
					{ name: '__**一般:**__', value: `**[名前]** ${server.name}\n**[ID]** ${server.id}\n**[作成者]** <@${server.ownerId}>` },
					{ name: '__**時間:**__', value: `**[作成日]** ${new Date(server.createdTimestamp).toLocaleDateString()}` },
					{ name: '__**チャンネル:**__', value: `**[ルール]** <#${server.rulesChannelId || 'None'}>\n**[システム]** <#${server.systemChannelId || 'None'}>\n**[ウェジット]** <#${server.widgetChannelId || 'None'}>\n**[afk]** <#${server.afkChannelId || 'None'}>` },
					{ name: '__**数量:**__', value: `**[メンバー数]** ${server.memberCount}(<:user:957073328059842590> :${members.filter(mem => !mem.bot).size}, <:bot:957073326520533033>:${members.filter(mem => mem.user.bot).size})\n**[テキストチャンネル数]** ${server.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').size}\n**[ボイスチャンネル数]** ${server.channels.cache.filter(ch => ch.type === 'GUILD_VOICE').size || 'None'}\n**[絵文字数]** ${server.emojis.cache.size || 'None'}\n**[ブースト数]** ${server.premiumSubscriptionCount || '0'} ブースト` },
				)
				.setThumbnail(server.iconURL({ format: 'png' }))
				.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			await interaction.reply({ embeds: [s] });
			}
		else if (type === 'Emoji') {
			if (!emoji) return error_invalid(interaction, client, '絵文字')
			let anime = 'いいえ'
			if (emoji.animated) anime = 'はい';
			const e = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('絵文字の詳細')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.addFields(
					{ name: '__**一般:**__', value: `**[名前]** ${emoji.name}\n**[ID]** ${emoji.id}` },
					{ name: '__**時間:**__', value: `**[作成日]** ${new Date(emoji.createdTimestamp).toLocaleDateString()}` },
					{ name: '__**その他:**__', value: `**[アニメ化]** ${anime}\n**[URL]** ${emoji.url}` },
				)
				.setThumbnail(emoji.url)
				.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();

			await interaction.reply({ embeds: [e] });
		}
		else if (type === 'User' || 'Member') {
			if (!user.bot) bot = '<:user:957073328059842590> ユーザー';
			if (!member.user.bot) bot = '<:user:957073328059842590> ユーザー';

			const profileData = await profileModel.findOne({ _id: user.id || member.id });
			if (profileData) {
				coins = profileData.coins + '*coins*';
				evaluation = profileData.evaluation;
				if (evaluation >= 8 && evaluation <= 10) mark = '<:check:914852919768125440>';
				else if (evaluation >= 4 && evaluation < 8) mark = '<:care:914852933332500502>';
				else if (evaluation >= 0 && evaluation < 4) mark = '<:red_cross:914852946481659904>';
			}
			else if (profileData == null) {
				coins = '不明';
				evaluation = '不明';
				mark = '<:unknown:914852959777615925>';
			}
			const period = Math.round((Date.now() - member.joinedAt) / 86400000);
			let status = '<:online:914864902160666634> オンライン';
			if (member.presence.status === 'idle') status = '<:idle:914864915058151456> 退席中';
			else if (member.presence.status === 'dnd') status = '<:dnd:914864927401988157> 取組中';
			else if (member.presence.status === 'offline') status = '<:offline:914864945361985627> オフライン';

			if (type === 'User') {
				const u = new MessageEmbed()
					.setColor('#89c3eb')
					.setTitle('ユーザーの詳細')
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.addFields(
						{ name: '__**一般:**__', value: `**[名前]** ${user.tag}\n**[ID]** ${user.id}\n**[種類]** ${bot}` },
						{ name: '__**時間:**__', value: `**[作成日]** ${new Date(user.createdTimestamp).toLocaleDateString()}` },
						{ name: '__**ボット内:**__', value: `**[コイン]** ${coins}\n**[評価値]** ${evaluation} ${mark}` },
					)
					.setThumbnail(user.displayAvatarURL({ format: 'png' }))
					.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
					.setTimestamp();
				if (!user) return error_invalid(interaction, client, 'ユーザー');
				await interaction.reply({ embeds: [u] });

			}

			else if (type === 'Member') {
				const m = new MessageEmbed()
					.setColor('#89c3eb')
					.setTitle('メンバーの詳細')
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.addFields(
						{ name: '__**一般:**__', value: `**[名前]** ${member.user.tag}\n**[ID]** ${member.id}\n**[ニックネーム]** ${member.nickname || 'None'}\n**[種類]** ${bot}` },
						{ name: '__**時間:**__', value: `**[作成日]** ${new Date(member.user.createdTimestamp).toLocaleDateString()}\n**[参加日]** ${new Date(member.joinedTimestamp).toLocaleDateString() || 'None'}\n**[参加期間]** ${period || 'None'} 日` },
						{ name: '__**ステータス:**__', value: `**[一般]** ${status || 'None'}` },
						{ name: '__**ボット内:**__', value: `**[コイン]** ${coins}\n**[評価値]** ${evaluation} ${mark}` },
						{ name: '__**ロール:**__', value: `**[最上位ロール]**\n${member.roles.highest || 'None'}\n**[ロール (${member.roles.cache.size})]**\n${member.roles.cache.map(role => `${role}`).join(' , ') || 'None'}` },
					)
					.setThumbnail(member.displayAvatarURL({ format: 'png' }))
					.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
					.setTimestamp();
				if (!member) return error_invalid(interaction, client, 'メンバー');
				await interaction.reply({ embeds: [m] });
			}
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