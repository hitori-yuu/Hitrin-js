const { EmbedBuilder } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'channelDelete',

	async execute(channel) {
        const AuditLogs = await channel.guild.fetchAuditLogs({ limit: 1 });

        const log = AuditLogs.entries.first()
        const member = channel.guild.members.cache.get(log.executor.id)

        const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
            .setTitle('チャンネル削除')
            .setDescription(
                `<@${member.id}> が チャンネル \`#${log.target.name}\` を削除しました。`
            )
            .addFields(
                {
                    name: '__**チャンネル:**__',
                    value: `**[名前]** ${log.target.name}\n**[ID]** ${log.target.id}`
                },
                {
                    name: '__**理由:**__',
                    value: log.reason || 'None'
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const guildsData = await logsChannelsModel.findOne({ id: channel.guild.id});
        if (guildsData) {
            channel.guild.channels.cache.get(guildsData.channel.id).send({embeds: [logEmbed]});
        } else {
            return;
        }
	},
};
