const { EmbedBuilder } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../functions/embeds');
const config = require('../../config.json');

module.exports = {
    name: 'user',
    description: '指定したユーザーの詳細を表示します。',
    usage: '[ユーザーID]',
    category: 'information',
    args: true,

    async execute(message, args) {
        const userId = args[0].toLowerCase();
        const user = await message.client.users.fetch(userId);

        if (!user)
            return message.channel.send({
                embeds: [CustomErrorEmbed('指定したユーザーは存在しません。')]
            });

        const userEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension: 'png' }), url: message.author.displayAvatarURL({ extension: 'png' }) })
            .setTitle(`${user.username}#${user.discriminator} の詳細`)
            .setThumbnail(user.displayAvatarURL({ extension: 'png' }), user.displayAvatarURL({ extension: 'png' }))
            .addFields(
                {
                    name: '__**一般:**__',
                    value: `**[名前]** ${user.username}\n**[ID]** ${user.id || 'None'}\n**[種類]** ${user.bot ? '🤖ボット' : '👤ユーザー'}`
                },
                {
                    name: '__**時間:**__',
                    value: `**[作成日時]** <t:${Math.floor(new Date(user.createdTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(user.createdTimestamp) / 1000)}:R>)`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        message.channel.send({
            embeds: [userEmbed]
        });
    },
};