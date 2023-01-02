const { EmbedBuilder } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../functions/embeds');
const config = require('../../config.json');

module.exports = {
    name: 'member',
    description: '指定したメンバーの詳細を表示します。',
    usage: '[ユーザーID]',
    category: 'information',
    args: true,

    async execute(message, args) {
        const userId = args[0].toLowerCase();
        const member = message.guild.members.cache.get(userId);

        if (!member)
            return message.channel.send({
                embeds: [CustomErrorEmbed('指定したメンバーは存在しません。')]
            });

        const memberEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ extension: 'png' }), url: member.user.displayAvatarURL({ extension: 'png' }) })
            .setTitle(`${member.displayName} の詳細`)
            .setThumbnail(member.displayAvatarURL({extension: 'png'}), member.displayAvatarURL({ extension: 'png' }))
            .addFields(
                {
                    name: '__**一般:**__',
                    value: `**[名前]** ${member.user.tag}\n**[ID]** ${member.id || 'None'}\n**[ニックネーム]** ${member.nickname || 'None'}\n**[種類]** ${member.bot ? '🤖ボット' : '👤ユーザー'}`
                },
                {
                    name: '__**時間:**__',
                    value: `**[参加日時]** <t:${Math.floor(new Date(member.joinedTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(member.joinedTimestamp) / 1000)}:R>)\n**[作成日時]** <t:${Math.floor(new Date(member.user.createdTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(member.user.createdTimestamp) / 1000)}:R>)`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        message.channel.send({
            embeds: [memberEmbed]
        });
    },
};