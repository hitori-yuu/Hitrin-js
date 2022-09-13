const { EmbedBuilder } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'voiceStateUpdate',

	async execute(oldMember, newMember) {
        try {
            var executor = oldMember;
            if (!oldMember.channelId) executor = newMember;
            const member = executor.guild.members.cache.get(executor.id);

            var message = `<#${executor.channelId}> から切断しました。`
            if (executor === newMember) message = `<#${newMember.channelId}> に接続しました。`;
            const channel = executor.guild.channels.cache.get(executor.channelId);

            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
                .setTitle('ボイスチャンネル更新')
                .setDescription(
                    `<@${member.id}> が ${message}`
                )
                .addFields(
                    {
                        name: '__**チャンネル:**__',
                        value: `**[名前]** ${channel.name}\n**[ID]** ${channel.id}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            const guildsData = await logsChannelsModel.find();
            const data = guildsData.filter(data => data.guild.id  === executor.guild.id);
            if (data.length <= 0) {
                return;
            } else {
                executor.guild.channels.cache.get(data[0].channel.id).send({embeds: [logEmbed]});
            }
        } catch (error) {
            return console.error('[エラー]イベント時にエラーが発生しました。\n内容: ' + error.message);
        }
	},
};
