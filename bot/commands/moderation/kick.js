const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

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
            'ja': '指定したメンバーをKickします。',
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
                'ja': 'Kickするメンバーを選択。',
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
                'en-US': 'Select members to be kick.',
                'ja': 'Kickする理由を入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
        try {
            const member = interaction.options.getMember('member');
            const reason = interaction.options.getString('reason') || 'None';

            if (!member) return ArgumentError(interaction, member);
            if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) return PermissionError(interaction, 'メンバーのKick');
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) return BotPermissionError(interaction, 'メンバーのKick');
            if (!member.kickable) return CustomError(interaction, 'そのメンバーはKickできません。');

            interaction.guild.members.kick(member, `Kicked by ${interaction.member.user.tag} 「${reason}」`).then(member => {
                const kickEmbed = new EmbedBuilder()
                    .setColor('#93ca76')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setDescription(`<@${member.id}> をサーバーからKickしました。\n理由: \`${reason}\``)
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [kickEmbed]
                });
            })
        } catch(error) {
            return InteractionError(interaction, error);
        }
	},
};
