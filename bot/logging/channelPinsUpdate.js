const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'channelPinsUpdate',

	async execute(channel) {
        try {
            if (!channel.guild.members.cache.get(channel.client.user.id).permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
            const AuditLogs = await channel.guild.fetchAuditLogs({ limit: 1 });

            const log = AuditLogs.entries.first()
            const member = channel.guild.members.cache.get(log.target.id)

            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
                .setTitle('チャンネル作成')
                .setDescription(
                    `<@${member.id}> が \`#${log.extra.channel.name}\` でのピン留めを更新しました。`
                )
                .addFields(
                    {
                        name: '__**チャンネル:**__',
                        value: `**[名前]** ${log.extra.channel.name}\n**[ID]** ${log.extra.channel.id}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            const guildsData = await logsChannelsModel.find();
            const data = guildsData.filter(data => data.guild.id === channel.guild.id);
            if (!data || !data.length > 0) {
                return;
            } else {
                channel.guild.channels.cache.get(data[0].channel.id).send({embeds: [logEmbed]});
                return;
            }
        } catch (error) {
            return console.error('[エラー]イベント時にエラーが発生しました。\n内容: ' + error.message);
        }
	},
};
