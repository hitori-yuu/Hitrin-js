const { EmbedBuilder } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'roleCreate',

	async execute(role) {
        const AuditLogs = await role.guild.fetchAuditLogs({ limit: 1 });

        const log = AuditLogs.entries.first()
        const member = role.guild.members.cache.get(log.executor.id)

        console.log(log);

        const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
            .setTitle('ロール作成')
            .setDescription(
                `<@${member.id}> が ロール ${role} を作成しました。`
            )
            .addFields(
                {
                    name: '__**ロール:**__',
                    value: `**[名前]** ${role.name}\n**[ID]** ${role.id}`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const guildsData = await logsChannelsModel.findOne({ id: role.guild.id });
        if (guildsData) {
            role.guild.channels.cache.get(guildsData.channel.id).send({embeds: [logEmbed]});
        } else {
            return;
        }
	},
};
