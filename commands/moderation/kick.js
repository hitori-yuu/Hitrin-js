const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('kick')
        .setNameLocalizations({
            'en-US': 'kick',
            'ja': '追放',
        })
        .setDescription('Kick the specified member.')
        .setDescriptionLocalizations({
            'en-US': 'Kick the specified member.',
            'ja': '指定したメンバーを追放します。',
        })
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(
            option => option
            .setName('member')
            .setNameLocalizations({
                'en-US': 'member',
                'ja': 'メンバー',
            })
            .setDescription('Select members to be kick.')
            .setDescriptionLocalizations({
                'en-US': 'Select members to be kick.',
                'ja': '追放するメンバーを選択。',
            })
            .setRequired(true)
        )
        .addStringOption(
            option => option
            .setName('reason')
            .setNameLocalizations({
                'en-US': 'reason',
                'ja': '理由',
            })
            .setDescription('Select members to be ban.')
            .setDescriptionLocalizations({
                'en-US': 'Select members to be ban.',
                'ja': '禁止する理由を入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'None';

        if (member.kickable) {
            interaction.guild.members.kick(member, `Kicked by ${interaction.member.user.tag} 「${reason}」`).then(member => {
                const kickEmbed = new EmbedBuilder()
                    .setColor('#93ca76')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setDescription(`<@${member.id}> をサーバーから追放しました。\n理由: \`${reason}\``)
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
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setDescription(`<@${member.id}> を追放できませんでした。`)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            interaction.followUp({
                embeds: [failedEmbed]
            });
        }
	},
};
