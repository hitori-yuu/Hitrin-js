const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

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
            'ja': '指定したメンバーをBanします。',
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
                'ja': 'Banするメンバーを選択。',
            })
        )
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
                'ja': 'ユーザーのIDを入力。',
            })
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
                'ja': 'Banする理由を入力。',
            })
        )
        .addNumberOption(
            option => option
            .setName('days')
            .setNameLocalizations({
                'en-US': 'days',
                'ja': '日数',
            })
            .setDescription('Enter the number of messages to delete. From 0 to 7')
            .setDescriptionLocalizations({
                'en-US': 'Enter the number of messages to delete. From 0 to 7',
                'ja': 'メッセージを削除する日数を入力。０～７まで',
            })
        ),

	async execute(interaction) {
        try {
            const member = interaction.options.getMember('member') || interaction.options.getString('user');
            const reason = interaction.options.getString('reason') || 'None';
            const days = interaction.options.getNumber('days') || 0;

            if (!member) return ArgumentError(interaction, member);
            if (interaction.options.getMember('member') && interaction.options.getString('user')) return CustomError(interaction, 'メンバーの指定はコマンド上で選択またはIDを入力するかのどちらかにしてください。')
            if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return PermissionError(interaction, 'メンバーのBan');
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return BotPermissionError(interaction, 'メンバーのBan');
            if (!member.bannable) return CustomError(interaction, 'そのメンバーはBanできません。');
            if (days < 1 || days > 7) {
                const failedEmbed = new EmbedBuilder()
                    .setColor('#d9333f')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setDescription(`日数の指定は**0から7まで**にしてください。`)
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                return interaction.followUp({
                    embeds: [failedEmbed]
                });
            }

            interaction.guild.members.ban(member || interaction.client.users.fetch(member), { days: days, reason: `Baned by ${interaction.member.user.tag} 「${reason}」` }).then(member => {
                const banEmbed = new EmbedBuilder()
                    .setColor('#93ca76')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setDescription(`<@${member.id}> をサーバーからBanしました。\n理由: \`${reason}\``)
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [banEmbed]
                });
            });
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
