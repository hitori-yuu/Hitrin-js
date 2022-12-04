const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('member')
        .setNameLocalizations({
            'en-US': 'member',
            'ja': 'メンバー',
        })
		.setDescription('Display information about that member.')
        .setDescriptionLocalizations({
            'en-US': 'Display information about that member.',
            'ja': 'メンバーの情報を表示します。',
        })
        .setDMPermission(false)
        .addUserOption(
            option => option
            .setName('member')
            .setNameLocalizations({
                'en-US': 'member',
                'ja': 'メンバー',
            })
            .setDescription('Select a member.')
            .setDescriptionLocalizations({
                'en-US': 'Select a member.',
                'ja': 'メンバーを選択。',
            })
            .setRequired(true)
        ),

	async execute(interaction, client) {
        try {
            const member = interaction.options.getMember('member');

            const memberEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setTitle(`${member.user.username} の詳細`)
                .setThumbnail(member.displayAvatarURL({extension: 'png'}), member.displayAvatarURL({extension: 'png'}))
                .addFields(
                    {
                        name: '__**一般:**__',
                        value: `**[名前]** ${member.user.tag}\n**[ID]** ${member.id || 'None'}\n**[ニックネーム]** ${member.nickname || 'None'}`
                    },
                    {
                        name: '__**時間:**__',
                        value: `**[参加日時]** ${new Date(member.joinedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n**[作成日時]** ${new Date(member.user.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
                    },
                    {
                        name: '__**権限:**__',
                        value: `\`${member.permissions.toArray().join('`, `')}\``
                    }
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [memberEmbed]
            });
        } catch(error) {
			return InteractionError(interaction, error);
        }
	},
};
