const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: {
		name: 'メンバーを追放',
		type: 2,
	},

	async execute(interaction) {
		const member = interaction.guild.members.cache.get(interaction.targetId);

        if (interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            if (member.kickable) {
                interaction.guild.members.kick(member, `Kicked by ${interaction.member.user.username}`).then(member => {
                    const kickEmbed = new EmbedBuilder()
                    .setColor('#93ca76')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL(), url: interaction.user.displayAvatarURL() })
                    .setDescription(`<@${member.id}> をサーバーから追放しました。`)
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                    interaction.followUp({
                        embeds: [kickEmbed]
                    });
                })
            }
            else {
                const failedEmbed = new EmbedBuilder()
                .setColor('#d9333f')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL(), url: interaction.user.displayAvatarURL() })
                .setDescription(`<@${member.id}> を追放できませんでした。`)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [failedEmbed]
                });
            }
        } else {
            const failedEmbed = new EmbedBuilder()
            .setColor('#d9333f')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL(), url: interaction.user.displayAvatarURL() })
            .setDescription('実行に必要な権限がありません: `メンバーをキック`')
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            interaction.followUp({
                embeds: [failedEmbed]
            });
        }


	},
};