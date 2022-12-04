const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { isCreatedGuild } = require('../functions/isAvailable');
const { guildsData } = require('../functions/MongoDB');
const { auditLog } = require('../functions/auditLog');
const { hasPermissions } = require('../functions/hasPermissions');
const { Error } = require('../handlers/error');

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
	name: 'roleUpdate',

	async execute(oldRole, newRole) {
        try {
            const guild = await guildsData(oldRole.guild);

            if (!hasPermissions(oldRole.guild.members.cache.get(oldRole.client.user.id), PermissionFlagsBits.ViewAuditLog)) return;
            if (!await isCreatedGuild(oldRole.guild)) return;
            if (!guild.logging.boolean == true) return;

            const log = await auditLog(oldRole.guild);
            const executor = oldRole.guild.members.cache.get(log.executor.id);

            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: executor.user.tag, iconURL: executor.displayAvatarURL({extension: 'png'}) })
                .setTitle('ロール更新')
                .setDescription(
                    `<@${executor.id}> が ロール \`#${log.target.name}\` を更新しました。`
                )
                .addFields(
                    {
                        name: '__**ロール:**__',
                        value: `**[名前]** ${log.target.name}\n**[ID]** ${log.target.id}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            for (let i = 0; log.changes.length; i++) {
                if (log.changes[i] == undefined) break;
                var permissions_old, permissions_new = 'None';
                if (log.changes[i].key == 'allow'|| log.changes[i].key == 'deny') permissions_old, permissions_new = 'None';
                else if (!log.changes[i].old == '0') permissions_old = new PermissionsBitField(log.changes[i].old).toArray().join('\`, \`');
                else if (!log.changes[i].new == '0') permissions_new = new PermissionsBitField(log.changes[i].new).toArray().join('\`, \`');
                logEmbed.addFields(
                    {
                        name: `__**${key[log.changes[i].key] || 'None'}:**__`,
                        value: `**[旧]** \`${permissions_old || 'None'}\`\n**[新]** \`${permissions_new || 'None'}\``
                    }
                )
            };

            if (guild.logging.boolean && guild.logging.channel.id) {
                oldRole.guild.Roles.cache.get(guild.logging.channel.id).send({
                    embeds: [logEmbed]
                });
            };
        } catch (error) {
            return Error(error);
        }
	},
};
