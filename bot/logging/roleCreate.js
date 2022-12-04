const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { isCreatedGuild } = require('../functions/isAvailable');
const { guildsData } = require('../functions/MongoDB');
const { auditLog } = require('../functions/auditLog');
const { hasPermissions } = require('../functions/hasPermissions');
const { Error } = require('../handlers/error');

module.exports = {
	name: 'roleCreate',

	async execute(role) {
        try {
            const guild = await guildsData(role.guild);

            if (!hasPermissions(role.guild.members.cache.get(role.client.user.id), PermissionFlagsBits.ViewAuditLog)) return;
            if (!await isCreatedGuild(role.guild)) return;
            if (!guild.logging.boolean == true) return;

            const log = await auditLog(role.guild);
            const executor = role.guild.members.cache.get(log.executor.id);
            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: executor.user.tag, iconURL: executor.displayAvatarURL({extension: 'png'}) })
                .setTitle('ロール作成')
                .setDescription(
                    `<@${executor.id}> が ロール ${role} を作成しました。`
                )
                .addFields(
                    {
                        name: '__**ロール:**__',
                        value: `**[名前]** ${role.name}\n**[ID]** ${role.id}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            if (guild.logging.boolean && guild.logging.channel.id) {
                role.guild.channels.cache.get(guild.logging.channel.id).send({
                    embeds: [logEmbed]
                });
            };
        } catch (error) {
            return Error(error);
        }
	},
};
