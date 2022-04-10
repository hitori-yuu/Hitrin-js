const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
const version = process.env.VERSION;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('ボットの詳細を表示します。'),
	async execute(interaction, client) {
		const author = client.users.cache.get('874184214130602015');
		const embed = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('Bot Details')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.addFields(
				{ name: '__**一般:**__', value: `**[名前]** ${client.user.tag}\n**[ID]** ${client.user.id}\n**[作成者]** <@${author.id}>` },
				{ name: '__**時間:**__', value: `**[作成日]** ${new Date(client.user.createdTimestamp).toLocaleDateString()}` },
				{ name: '__**バージョン:**__', value: `**[ボット]** ${version}\n**[使用言語]** discord.js@${require('discord.js').version}` },
				{ name: '__**ステータス:**__', value: `**[反応速度]** ws:${client.ws.ping}ms\n**[サーバー数]** ${client.guilds.cache.size} サーバー\n**[ユーザー数]** ${client.users.cache.size} ユーザー` },
                { name: '__**使用素材等:**__', value: `**[画像]** [ICOOON MONO](https://icooon-mono.com/)\n` },
			)
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
        await interaction.reply({ embeds: [embed] });
	},
};