const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('unban')
        .setNameLocalizations({
            'en-US': 'unban',
            'ja': '禁止解除',
        })
        .setDescription('Unban the specified member.')
        .setDescriptionLocalizations({
            'en-US': 'Unban the specified member.',
            'ja': '指定したメンバーのBanを解除します。',
        })
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(
            option => option
            .setName('user')
            .setNameLocalizations({
                'en-US': 'user',
                'ja': 'ユーザー',
            })
            .setDescription('Enter the ID of that user to be unban.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the ID of that user to be unban.',
                'ja': 'Banを解除するユーザーのIDを入力。',
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
            .setDescription('Enter the reason to unban.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the reason to unban.',
                'ja': 'Banを解除する理由を入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
        try {
            const id = interaction.options.getString('user');
            const reason = interaction.options.getString('reason') || 'None';
            const user = await interaction.client.users.fetch(id);

            if (!user) return ArgumentError(interaction, user);
            if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return PermissionError(interaction, 'メンバーのBan');
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return BotPermissionError(interaction, 'メンバーのBan');

            interaction.guild.bans.fetch(user.id)
                .then(() =>{
                    interaction.guild.bans.remove(user, `Unbaned by ${interaction.member.user.tag} 「${reason}」`).then(user => {
                        const banEmbed = new EmbedBuilder()
                            .setColor('#93ca76')
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                            .setDescription(`<@${user.id}> のBanを解除しました。\n理由: \`${reason}\``)
                            .setTimestamp()
                            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                        interaction.followUp({
                            embeds: [banEmbed]
                        });
                    });
                }).catch(() => {
                    return CustomError(interaction, 'ユーザーのBanの解除に失敗しました。');
                });
        } catch(error) {
            return InteractionError(interaction, error);
        }
	},
};
