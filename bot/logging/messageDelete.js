const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { isCreatedGuild } = require('../functions/isAvailable');
const { guildsData } = require('../functions/MongoDB');
const { auditLog } = require('../functions/auditLog');
const { hasPermissions } = require('../functions/hasPermissions');
const { Error } = require('../handlers/Error');

module.exports = {
	name: 'messageDelete',

	async execute(message) {
        try {
            const guild = await guildsData(message.guild);

            if (!hasPermissions(message.guild.members.cache.get(message.client.user.id), PermissionFlagsBits.ViewAuditLog)) return;
            if (!await isCreatedGuild(message.guild)) return;
            if (!guild.logging.enable || guild.logging.enable == undefined) return;

            const log = await auditLog(message.guild);
            const executor = message.guild.members.cache.get(log.executor.id);
            const target = message.guild.members.cache.get(log.target.id);

            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: executor.user.tag, iconURL: executor.displayAvatarURL({extension: 'png'}) })
                .setTitle('メッセージ削除')
                .setDescription(
                    `<@${executor.id}> が <@${target.id}> のメッセージを削除しました。`
                )
                .addFields(
                    {
                        name: '__**チャンネル:**__',
                        value: `**[名前]** ${log.extra.channel.name || 'None'}\n**[ID]** ${log.extra.channel.id || 'None'}`
                    },
                    {
                        name: '__**メッセージ送信者:**__',
                        value: `**[名前]** ${target.user.tag}\n**[ID]** ${target.id}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            if (guild.logging.enable && guild.logging.channel.id) {
                message.guild.channels.cache.get(guild.logging.channel.id).send({
                    embeds: [logEmbed]
                });
            };
        } catch (error) {
            return Error(error);
        }
	},
};
