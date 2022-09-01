const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('指定したメンバーをサーバーから追放します。')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(
            option => option
            .setName('メンバー')
            .setDescription('追放するメンバーを選択')
            .setRequired(true)
        ),

	async execute(interaction) {
        const member = interaction.options.getMember('メンバー');

        if (member.kickable) {
            interaction.guild.members.kick(member).then(member => {
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
	},
};
