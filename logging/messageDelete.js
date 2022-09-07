const { EmbedBuilder } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'messageDelete',

	async execute(message) {
        const AuditLogs = await message.guild.fetchAuditLogs({ limit: 1 });

        const log = AuditLogs.entries.first();
        const member = message.guild.members.cache.get(log.executor.id);
        const target = message.guild.members.cache.get(log.target.id);

        console.log(log)

        const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
            .setTitle('メッセージ削除')
            .setDescription(
                `<@${member.id}> が <@${target.id}> のメッセージを削除しました。`
            )
            .addFields(
                {
                    name: '__**チャンネル:**__',
                    value: `**[名前]** ${log.extra.channel.name}\n**[ID]** ${log.extra.channel.id}`
                },
                {
                    name: '__**メッセージ送信者:**__',
                    value: `**[名前]** ${target.user.tag}\n**[ID]** ${target.id}`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const guildsData = await logsChannelsModel.findOne({ id: message.guild.id });
        if (guildsData) {
            message.guild.channels.cache.get(guildsData.channel.id).send({embeds: [logEmbed]});
        } else {
            return;
        }
	},
};
