const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

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
            'ja': '指定したメンバーの禁止を解除します。',
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
            .setDescription('Enter the ID of that user.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the ID of that user.',
                'ja': '解除するユーザーのIDを入力。',
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
                'ja': '解除する理由を入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
        const id = interaction.options.getString('user');
        const reason = interaction.options.getString('reason') || 'None';

        const user = await interaction.client.users.fetch(id);

        if (interaction.guild.bans.fetch(user.id)) {
            interaction.guild.bans.remove(user, `Unbaned by ${interaction.member.user.tag} 「${reason}」`).then(user => {
                const banEmbed = new EmbedBuilder()
                    .setColor('#93ca76')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setDescription(`<@${user.id}> の禁止を解除しました。\n理由: \`${reason}\``)
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [banEmbed]
                });
            })
        } else {
            const failedEmbed = new EmbedBuilder()
                .setColor('#d9333f')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setDescription(`<@${member.id}> の禁止を解除できませんでした。`)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            interaction.followUp({
                embeds: [failedEmbed]
            });
        }
	},
};
