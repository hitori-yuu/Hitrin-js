const { EmbedBuilder, SlashCommandBuilder, codeBlock, PermissionFlagsBits } = require('discord.js');
const { agendaCreate } = require('../../functions/meetings');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('agenda-create')
        .setNameLocalizations({
            'en-US': 'agenda-create',
            'ja': '議題作成',
        })
        .setDescription('Send an inquiry to the Bot\'s management.')
        .setDescriptionLocalizations({
            'en-US': 'Send an inquiry to the Bot\'s management.',
            'ja': '全コマンドまたは特定のコマンドの詳細を表示します。',
        })
		.setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(
            option => option
            .setName('content')
            .setNameLocalizations({
                'en-US': 'content',
                'ja': '内容',
            })
            .setDescription('Enter the inquiry details.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the inquiry details.',
                'ja': '議題を入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
		try {
            if (!interaction.guild.id === '876116489902653513') return CustomError(interaction, 'この機能は専用のサーバーでのみ使用できます。');
            const content = interaction.options.getString('content');
            if (!content) return ArgumentError(interaction, content);

            const agendaEmbed = new EmbedBuilder()
                .setColor('#93ca76')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setTitle('議題を作成しました。')
                .addFields(
                    {
                        name: '__**議題:**__',
                        value: `${content}`,
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await agendaCreate(interaction, content);
            await interaction.followUp({
                embeds: [agendaEmbed]
            });
		} catch (error) {
			return InteractionError(interaction, error);
		}
	},
};
