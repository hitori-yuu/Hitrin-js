const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'emojiDelete',

	async execute(emoji) {
        try {
            if (!emoji.guild.members.cache.get(emoji.client.user.id).permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
            const AuditLogs = await emoji.guild.fetchAuditLogs({ limit: 1 });

            const log = AuditLogs.entries.first()
            const member = emoji.guild.members.cache.get(log.executor.id)
            var anime = '静止画';
            if (emoji.animated) anime = 'アニメーション';

            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
                .setTitle('絵文字削除')
                .setDescription(
                    `<@${member.id}> が 絵文字 \`${emoji}\` を削除しました。`
                )
                .addFields(
                    {
                        name: '__**絵文字:**__',
                        value: `**[名前]** ${emoji.name}\n**[ID]** ${emoji.id}\n**[種類]** ${anime}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            const guildsData = await logsChannelsModel.find();
            const data = guildsData.filter(data => data.guild.id === emoji.guild.id);
            if (data[0] === undefined) {
                return;
            } else {
                emoji.guild.channels.cache.get(data[0].channel.id).send({embeds: [logEmbed]});
                return;
            }
        } catch (error) {
            return console.error('[エラー]イベント時にエラーが発生しました。\n内容: ' + error.message);
        }
	},
};
