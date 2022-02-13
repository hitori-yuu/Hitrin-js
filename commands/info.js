const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
const version = process.env.VERSION;
const profileModel = require('../models/profileSchema');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('指定したものの詳細を表示します。')
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('ボット', 'Bot').addChoice('ユーザー', 'User').addChoice('メンバー', 'Member').addChoice('サーバー', 'Server'))
		.addUserOption(option => option.setName('対象').setDescription('ユーザーかメンバーを選択')),
	async execute(interaction, client) {
		const type = interaction.options.getString('種類');
		const user = interaction.options.getUser('対象');
		const member = interaction.options.getMember('対象');
		const server = interaction.guild;
		const members = interaction.guild.members.cache;
		const author = client.users.cache.get('874184214130602015');
		let coins;
		let evaluation;
		let mark;
		let bot = '🤖ボット';

		if (!user.bot) bot = '👤ユーザー';
		if (!member.user.bot) bot = '👤ユーザー';

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

		const u = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('ユーザーの詳細')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.addFields(
				{ name: '__**一般:**__', value: `**[名前]** ${user.tag}\n**[ID]** ${user.id}\n**[種類]]** ${bot}` },
				{ name: '__**時間:**__', value: `**[作成日]** ${new Date(user.createdTimestamp).toLocaleDateString()}` },
				{ name: '__**ボット内:**__', value: `**[コイン]** ${coins}\n**[評価値]** ${evaluation} ${mark}` },
			)
			.setThumbnail(user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
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
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		const s = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('サーバーの詳細')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.addFields(
				{ name: '__**一般:**__', value: `**[名前]** ${server.name}\n**[ID]** ${server.id}\n**[作成者]** <@${server.ownerId}>` },
				{ name: '__**時間:**__', value: `**[作成日]** ${new Date(server.createdTimestamp).toLocaleDateString()}\n**[ボット参加日]** ${new Date(server.joinedTimestamp).toLocaleDateString()}` },
				{ name: '__**数量:**__', value: `**[メンバー数]** ${server.memberCount}(👤:${members.filter(mem => !mem.user.bot).size}, 🤖:${members.filter(mem => mem.user.bot).size})\n**[テキストチャンネル数]** ${server.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').size}\n**[ボイスチャンネル数]** ${server.channels.cache.filter(ch => ch.type === 'GUILD_VOICE').size}\n**[絵文字数]** ${server.emojis.cache.size}\n**[ブースト数]** ${server.premiumSubscriptionCount || '0'} ブースト` },
			)
			.setThumbnail(server.iconURL({ format: 'png' }))
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		const b = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('Bot Details')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.addFields(
				{ name: '__**一般:**__', value: `**[名前]** ${client.user.tag}\n**[ID]** ${client.user.id}\n**[作成者]** <@${author.id}>` },
				{ name: '__**時間:**__', value: `**[作成日]** ${new Date(client.user.createdTimestamp).toLocaleDateString()}` },
				{ name: '__**バージョン:**__', value: `**[ボット]** ${version}\n**[使用言語]** discord.js@${require('discord.js').version}` },
				{ name: '__**ステータス:**__', value: `**[反応速度]** ws:${client.ws.ping}ms\n**[サーバー数]** ${client.guilds.cache.size} サーバー\n**[ユーザー数]** ${client.users.cache.size} ユーザー` },
			)
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();

		try {
			switch (type) {
			case 'User':
				await interaction.reply({ embeds: [u] });
				break;
			case 'Member':
				await interaction.reply({ embeds: [m] });
				break;
			case 'Server':
				await interaction.reply({ embeds: [s] });
				break;
			case 'Bot':
				await interaction.reply({ embeds: [b] });
				break;
			default:
				error_invalid(interaction, client, '種類');
			}
		}
		catch (error) {
			error_unknown(interaction, client, error);
		}
	},
};

function error_invalid(interaction, client, invalid) {
	const error = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription(`実行に必須なパラメータが無効です: \`${invalid || 'None'}\``)
		.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	return interaction.reply({ embeds: [error] });
}
function error_unknown(interaction, client, error) {
	const err = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription('無知のエラーが発生しました。既に開発者に報告されています。')
		.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	const error_log = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('エラー')
		.setDescription('【エラー内容】\n' + codeBlock('js', error))
		.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	const log = client.channels.cache.get('919599721184628807').send({ embeds: [error_log] });
	return interaction.reply({ embeds: [err] }), log;
}