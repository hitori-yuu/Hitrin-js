const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { isCreatedGuild } = require('../functions/isAvailable');
const { guildsData } = require('../functions/MongoDB');
const { auditLog } = require('../functions/auditLog');
const { hasPermissions } = require('../functions/hasPermissions');
const { Error } = require('../handlers/Error');

module.exports = {
	name: 'emojiCreate',

	async execute(emoji) {
        try {
            const guild = await guildsData(emoji.guild);

            if (!hasPermissions(emoji.guild.members.cache.get(emoji.client.user.id), PermissionFlagsBits.ViewAuditLog)) return;
            if (!await isCreatedGuild(emoji.guild)) return;
            if (!guild.logging.enable || guild.logging.enable == undefined) return;
            var anime = '静止画';
            if (emoji.animated) anime = 'アニメーション';

            const log = await auditLog(emoji.guild);
            const executor = emoji.guild.members.cache.get(log.executor.id);
            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: executor.user.tag, iconURL: executor.displayAvatarURL({extension: 'png'}) })
                .setTitle('絵文字作成')
                .setDescription(
                    `<@${executor.id}> が 絵文字 ${emoji} を作成しました。`
                )
                .addFields(
                    {
                        name: '__**絵文字:**__',
                        value: `**[名前]** ${emoji.name}\n**[ID]** ${emoji.id}\n**[種類]** ${anime}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            if (guild.logging.enable && guild.logging.channel.id) {
                emoji.guild.channels.cache.get(guild.logging.channel.id).send({
                    embeds: [logEmbed]
                });
            };
        } catch (error) {
            return Error(error);
        }
	},
};
