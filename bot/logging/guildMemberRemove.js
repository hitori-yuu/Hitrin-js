const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { isCreatedGuild } = require('../functions/isAvailable');
const { guildsData } = require('../functions/MongoDB');
const { auditLog } = require('../functions/auditLog');
const { hasPermissions } = require('../functions/hasPermissions');
const { Error } = require('../handlers/error');

module.exports = {
	name: 'guildMemberRemove',

	async execute(member) {
        try {
            const guild = await guildsData(member.guild);

            if (!await isCreatedGuild(member.guild)) return;
            if (!guild.logging.boolean == true) return;

            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({extension: 'png'}) })
                .setTitle('メンバー退出')
                .setDescription(
                    `<@${member.id}> がサーバーから退出しました。`
                )
                .addFields(
                    {
                        name: '__**メンバー:**__',
                        value: `**[名前]** ${member.user.tag}\n**[ID]** ${member.id}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            if (guild.logging.boolean && guild.logging.channel.id) {
                member.guild.channels.cache.get(guild.logging.channel.id).send({
                    embeds: [logEmbed]
                });
            };
        } catch (error) {
            return Error(error);
        }
	},
};
