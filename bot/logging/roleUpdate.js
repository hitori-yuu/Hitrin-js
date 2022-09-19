const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'roleUpdate',

	async execute(oldRole, newRole) {
        try {
            if (!oldRole.guild.members.cache.get(oldRole.client.user.id).permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
            const AuditLogs = await oldRole.guild.fetchAuditLogs({ limit: 1 });

            const log = AuditLogs.entries.first()
            const member = oldRole.guild.members.cache.get(log.executor.id)

            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
                .setTitle('ロール更新')
                .setDescription(
                    `<@${member.id}> が ロール ${newRole} を更新しました。`
                )
                .addFields(
                    {
                        name: '__**ロール:**__',
                        value: `**[名前]** ${newRole.name}\n**[ID]** ${newRole.id}`
                    },
                    {
                        name: `__**${log.changes[0].key || 'None'}:**__`,
                        value: `**[旧]** ${log.changes[0].old || 'None'}\n**[新]** ${log.changes[0].new || 'None'}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            const guildsData = await logsChannelsModel.find();
            const data = guildsData.filter(data => data.guild.id === oldRole.guild.id);
            if (!data || !data.length > 0) {
                return;
            } else {
                oldRole.guild.channels.cache.get(data[0].channel.id).send({embeds: [logEmbed]});
                return;
            }
        } catch (error) {
            return console.error('[エラー]イベント時にエラーが発生しました。\n内容: ' + error.message);
        }
	},
};
