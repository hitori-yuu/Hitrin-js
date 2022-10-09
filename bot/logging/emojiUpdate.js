const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { isCreatedGuild } = require('../functions/isAvailable');
const { guildsData } = require('../functions/MongoDB');
const { auditLog } = require('../functions/auditLog');
const { hasPermissions } = require('../functions/hasPermissions');
const { Error } = require('../handlers/Error');

const key = {
    'name': '名前',
    'permissions': '権限',
    'nsfw': 'NSFW',
    'parent': 'カテゴリー',
    'permissionOverwrites': '権限',
    'topic': 'トピック',
    'type': '種類',
    'allow': '許可',
    'deny': '禁止',
};

module.exports = {
	name: 'emojiUpdate',

	async execute(oldEmoji, newEmoji) {
        try {
            const guild = await guildsData(oldEmoji.guild);

            if (!hasPermissions(oldEmoji.guild.members.cache.get(oldEmoji.client.user.id), PermissionFlagsBits.ViewAuditLog)) return;
            if (!await isCreatedGuild(oldEmoji.guild)) return;
            if (!guild.logging.enable || guild.logging.enable == undefined) return;

            const log = await auditLog(oldEmoji.guild);
            const executor = oldEmoji.guild.members.cache.get(log.executor.id);

            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: executor.user.tag, iconURL: executor.displayAvatarURL({extension: 'png'}) })
                .setTitle('絵文字更新')
                .setDescription(
                    `<@${executor.id}> が 絵文字 ${log.target} を更新しました。`
                )
                .addFields(
                    {
                        name: '__**絵文字:**__',
                        value: `**[名前]** ${log.target.name}\n**[ID]** ${log.target.id}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            for (let i = 0; log.changes.length; i++) {
                if (log.changes[i] == undefined) break;
                logEmbed.addFields(
                    {
                        name: `__**${key[log.changes[i].key] || 'None'}:**__`,
                        value: `**[旧]** \`${log.changes[i].old || 'None'}\`\n**[新]** \`${log.changes[i].new || 'None'}\``
                    }
                )
            };

            if (guild.logging.enable && guild.logging.channel.id) {
                oldEmoji.guild.channels.cache.get(guild.logging.channel.id).send({
                    embeds: [logEmbed]
                });
            };
        } catch (error) {
            return Error(error);
        }
	},
};
