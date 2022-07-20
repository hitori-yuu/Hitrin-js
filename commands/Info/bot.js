const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    name: "bot",
    description: "Returns information about the bot.",

    run: async (client, interaction) => {
        const author = client.users.cache.get('874184214130602015');
		const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setColor('#89c3eb')
			.setTitle('Bot Details')
			.addFields(
				{ name: '__**一般:**__', value: `**[名前]** ${client.user.tag}\n**[ID]** ${client.user.id}\n**[作成者]** <@${author.id}>` },
				{ name: '__**時間:**__', value: `**[作成日]** ${new Date(client.user.createdTimestamp).toLocaleDateString()}` },
				{ name: '__**バージョン:**__', value: `**[ボット]** ${process.env.VERSION}\n**[使用言語]** discord.js@${require('discord.js').version}` },
				{ name: '__**ステータス:**__', value: `**[反応速度]** ws:${client.ws.ping}ms\n**[サーバー数]** ${client.guilds.cache.size} サーバー\n**[ユーザー数]** ${client.users.cache.size} ユーザー` },
			)
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
        interaction.followUp({ embeds: [embed] });
    },
};