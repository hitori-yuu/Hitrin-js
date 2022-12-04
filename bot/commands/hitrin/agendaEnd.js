const { EmbedBuilder, SlashCommandBuilder, codeBlock, PermissionFlagsBits } = require('discord.js');
const { agendaGet, agendaEnd } = require('../../functions/meetings');
const { guildsData } = require('../../functions/MongoDB');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('agenda-end')
        .setNameLocalizations({
            'en-US': 'agenda-end',
            'ja': '議題終了',
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
            .setName('message_id')
            .setNameLocalizations({
                'en-US': 'message_id',
                'ja': 'メッセージid',
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
            const message_id = interaction.options.getString('message_id');
            const guild = await guildsData(interaction.guild);
            const channel = interaction.guild.channels.cache.get(guild.settings.meetingChannel);
            const Data = await agendaGet(message_id)

            if (!message_id) return ArgumentError(interaction, message_id);
            if (!await channel.messages.fetch(message_id)) return ArgumentError(interaction, message_id);
            if (Data.isClosed) return CustomError(interaction, 'その会議は既に終了しています');

            await agendaEnd(interaction, message_id);
            await interaction.followUp({
                content: '会議を終了しました。'
            });
		} catch (error) {
			return InteractionError(interaction, error);
		}
	},
};
