const { EmbedBuilder } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'roleDelete',

	async execute(role) {
        const AuditLogs = await role.guild.fetchAuditLogs({ limit: 1 });

        const log = AuditLogs.entries.first()
        const member = role.guild.members.cache.get(log.executor.id)

        const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
            .setTitle('ロール削除')
            .setDescription(
                `<@${member.id}> が ロール \`${role.name}\` を削除しました。`
            )
            .addFields(
                {
                    name: '__**ロール:**__',
                    value: `**[名前]** ${role.name}\n**[ID]** ${role.id}`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const guildsData = await logsChannelsModel.find();
        const data = guildsData.filter(data => data.guild.id  === role.guild.id);
        try {
            if (data.length <= 0) {
                return;
            } else {
                role.guild.channels.cache.get(data[0].channel.id).send({embeds: [logEmbed]});
            }
        } catch (error) {
            return console.error('[エラー]イベント時にエラーが発生しました。\n内容: ' + error.message);
        }
	},
};
