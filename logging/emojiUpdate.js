const { EmbedBuilder } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'emojiUpdate',

	async execute(oldEmoji, newEmoji) {
        const AuditLogs = await oldEmoji.guild.fetchAuditLogs({ limit: 1 });

        const log = AuditLogs.entries.first()
        const member = oldEmoji.guild.members.cache.get(log.executor.id)

        const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
            .setTitle('絵文字更新')
            .setDescription(
                `<@${member.id}> が 絵文字 ${newEmoji} を更新しました。`
            )
            .addFields(
                {
                    name: '__**絵文字:**__',
                    value: `**[名前]** ${newEmoji.name}\n**[ID]** ${newEmoji.id}\n**[変更]** \`${oldEmoji.name}\` => \`${newEmoji.name}\``
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const guildsData = await logsChannelsModel.findOne({ id: oldEmoji.guild.id });
        if (guildsData) {
            oldEmoji.guild.channels.cache.get(guildsData.channel.id).send({embeds: [logEmbed]});
        } else {
            return;
        }
	},
};
