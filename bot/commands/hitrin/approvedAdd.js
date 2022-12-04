const { EmbedBuilder, SlashCommandBuilder, codeBlock, PermissionFlagsBits } = require('discord.js');
const { agendaCreate } = require('../../functions/meetings');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('approved-add')
        .setNameLocalizations({
            'en-US': 'approved-add',
            'ja': '承認済追加',
        })
        .setDescription('Candidate the specified member as approved.')
        .setDescriptionLocalizations({
            'en-US': 'Candidate the specified member as approved.',
            'ja': '指定されたメンバーを承認候補とします。',
        })
		.setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(
            option => option
            .setName('member')
            .setNameLocalizations({
                'en-US': 'member',
                'ja': 'メンバー',
            })
            .setDescription('Select members to list as approved candidates.')
            .setDescriptionLocalizations({
                'en-US': 'Select members to list as approved candidates.',
                'ja': '承認済の候補として挙げるメンバーを選択。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
		try {
            const member = interaction.options.getMember('member');
            if (!member) return ArgumentError(interaction, member);

            const agendaEmbed = new EmbedBuilder()
                .setColor('#93ca76')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setTitle('議題を作成しました。')
                .addFields(
                    {
                        name: '__**議題:**__',
                        value: `${member} を承認済に追加。`,
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await agendaCreate(interaction, `${member} を承認済に追加。`);
            await interaction.followUp({
                embeds: [agendaEmbed]
            });
		} catch (error) {
			return InteractionError(interaction, error);
		}
	},
};
