const { EmbedBuilder } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'messageUpdate',

	async execute(oldMessage, newMessage) {
        const AuditLogs = await oldMessage.guild.fetchAuditLogs({ limit: 1 });

        const log = AuditLogs.entries.first();
        const member = oldMessage.guild.members.cache.get(log.executor.id);

        const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
            .setTitle('メッセージ更新')
            .setDescription(
                `<@${member.id}> がメッセージを更新しました。`
            )
            .addFields(
                {
                    name: '__**チャンネル:**__',
                    value: `**[名前]** ${log.extra.channel.name}\n**[ID]** ${log.extra.channel.id}`
                },
                {
                    name: '__**メッセージ:**__',
                    value: `**[更新前]**\n${oldMessage.content}\n**[更新後]**\n${newMessage.content}`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const guildsData = await logsChannelsModel.findOne({ id: oldMessage.guild.id });
        if (guildsData) {
            oldMessage.guild.channels.cache.get(guildsData.channel.id).send({embeds: [logEmbed]});
        } else {
            return;
        }
	},
};
