const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('tts-end')
        .setNameLocalizations({
            'en-US': 'tts-end',
            'ja': '読み上げ終了',
        })
        .setDescription('Commands related to Text-to-Speech.')
        .setDescriptionLocalizations({
            'en-US': 'Commands related to Text-to-Speech.',
            'ja': '読み上げに関するコマンド。',
        })
		.setDMPermission(false),

	async execute(interaction) {
        try {
            const channel = interaction.member.voice.channel;
            const connection = getVoiceConnection(interaction.guild.id);

            if (!connection) return CustomError(interaction, '元々ボイスチャンネルに参加していません。');
            if (!channel) return CustomError(interaction, 'あなたが先にVCに入っている必要があります。');

            await connection.destroy(true);
            await interaction.client.voiceChannels.delete(channel.id);
            await interaction.followUp({
                content: '読み上げを終了しました。'
            });
        } catch (error) {
			return InteractionError(error, interaction);
        }
	},
};
