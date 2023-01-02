const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData, logsData } = require('../../functions/MongoDB');
const config = require('../../config.json');

module.exports = {
    name: 'bot',
    description: 'ボットの詳細を表示します。',
    category: 'information',

	async execute(message, args) {
        try {
            const { client } = message;
            const author = client.users.cache.get('874184214130602015');
            const logs = await logsData();

            const clientEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension: 'png' }), url: message.author.displayAvatarURL({ extension: 'png' }) })
                .setTitle(`${client.user.username} の詳細`)
                .setThumbnail(client.user.displayAvatarURL({ extension: 'png' }), client.user.displayAvatarURL({ extension: 'png' }))
                .addFields(
                    {
                        name: '__**一般:**__',
                        value: `**[名前]** ${client.user.username}\n**[ID]** ${client.user.id || 'None'}\n**[作成者]** <@${author.id}>\n**[バージョン]** ${config.version}`
                    },
                    {
                        name: '__**時間:**__',
                        value: `**[最終起動]** <t:${Math.floor(new Date(client.readyTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(client.readyTimestamp) / 1000)}:R>)`
                    },
                    {
                        name: '__**統計:**__',
                        value: `**[実行コマンド数]** ${logs.length}\n**[発生エラー数]** ${client.errors.size || '0'}\n**[ユーザー数]** ${client.users.cache.size}\n**[サーバー数]** ${client.guilds.cache.size}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await message.channel.send({
                embeds: [clientEmbed]
            });
        } catch (error) {
            return console.error(error);
        }
	},
};
