const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('ban')
        .setNameLocalizations({
            'en-US': 'ban',
            'ja': '禁止',
        })
        .setDescription('Ban the specified member.')
        .setDescriptionLocalizations({
            'en-US': 'Ban the specified member.',
            'ja': '指定したメンバーを禁止します。',
        })
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(
            option => option
            .setName('member')
            .setNameLocalizations({
                'en-US': 'member',
                'ja': 'メンバー',
            })
            .setDescription('Select members to be ban.')
            .setDescriptionLocalizations({
                'en-US': 'Select members to be ban.',
                'ja': '禁止するメンバーを選択。',
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
            .setDescription('Enter the reason to ban.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the reason to ban.',
                'ja': '禁止する理由を入力。',
            })
            .setRequired(true)
        )
        .addNumberOption(
            option => option
            .setName('days')
            .setNameLocalizations({
                'en-US': 'days',
                'ja': '日数',
            })
            .setDescription('Enter the number of messages to delete. 0 - 7')
            .setDescriptionLocalizations({
                'en-US': 'Enter the number of messages to delete. 0 - 7',
                'ja': 'メッセージを削除する日数を入力。０～７まで',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'None';
        const days = interaction.options.getNumber('days') || 0;

        if (member.bannable) {
            interaction.guild.members.ban(member, { days: days, reason: `baned by ${interaction.member.user.tag} 「${reason}」` }).then(member => {
                const banEmbed = new EmbedBuilder()
                    .setColor('#93ca76')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setDescription(`<@${member.id}> をサーバーから禁止しました。\n理由: \`${reason}\``)
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [banEmbed]
                });
            })
        } else if (!0 >= days && days <= 7)  {
            const failedEmbed = new EmbedBuilder()
                .setColor('#d9333f')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setDescription(`日数の指定は**0から7まで**にしてください。`)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            interaction.followUp({
                embeds: [failedEmbed]
            });
        } else {
            const failedEmbed = new EmbedBuilder()
                .setColor('#d9333f')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setDescription(`<@${member.id}> を禁止できませんでした。`)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            interaction.followUp({
                embeds: [failedEmbed]
            });
        }
	},
};
