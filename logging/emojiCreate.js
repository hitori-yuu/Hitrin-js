const { EmbedBuilder } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'emojiCreate',

	async execute(emoji) {
        const AuditLogs = await emoji.guild.fetchAuditLogs({ limit: 1 });

        const log = AuditLogs.entries.first()
        const member = emoji.guild.members.cache.get(log.executor.id)
        var anime = '静止画';
        if (emoji.animated) anime = 'アニメーション';

        const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
            .setTitle('絵文字作成')
            .setDescription(
                `<@${member.id}> が 絵文字 ${emoji} を作成しました。`
            )
            .addFields(
                {
                    name: '__**絵文字:**__',
                    value: `**[名前]** ${emoji.name}\n**[ID]** ${emoji.id}\n**[種類]** ${anime}`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const guildsData = await logsChannelsModel.findOne({ id: emoji.guild.id });
        if (guildsData) {
            emoji.guild.channels.cache.get(guildsData.channel.id).send({embeds: [logEmbed]});
        } else {
            return;
        }
	},
};
