const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { isCreatedGuild } = require('../functions/isAvailable');
const { guildsData } = require('../functions/MongoDB');
const { auditLog } = require('../functions/auditLog');
const { hasPermissions } = require('../functions/hasPermissions');
const { Error } = require('../handlers/error');

module.exports = {
	name: 'channelPinsUpdate',

	async execute(channel) {
        try {
            const guild = await guildsData(channel.guild);

            if (!hasPermissions(channel.guild.members.cache.get(channel.client.user.id), PermissionFlagsBits.ViewAuditLog)) return;
            if (!await isCreatedGuild(channel.guild)) return;
            if (!guild.logging.enable || guild.logging.enable == undefined) return;

            const log = await auditLog(channel.guild);
            const executor = channel.guild.members.cache.get(log.executor.id);

            var type = '作成'
            if (log.actionType == 'Delete') type = '削除';

            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: executor.user.tag.toString(), iconURL: executor.displayAvatarURL({extension: 'png'}) })
                .setTitle(`ピンの${type}`)
                .setDescription(
                    `<@${executor.id}> が チャンネル \`#${log.extra.channel.name}\` でピンを${type}しました。`
                )
                .addFields(
                    {
                        name: '__**チャンネル:**__',
                        value: `**[名前]** ${log.extra.channel.name}\n**[ID]** ${log.extra.channel.id}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            if (guild.logging.enable && guild.logging.channel.id) {
                channel.guild.channels.cache.get(guild.logging.channel.id).send({
                    embeds: [logEmbed]
                });
            };
        } catch (error) {
            return Error(error);
        }
	},
};
