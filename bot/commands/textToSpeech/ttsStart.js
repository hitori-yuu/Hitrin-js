const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { joinVoiceChannel } = require("@discordjs/voice");
const { textToSpeech, startTTS } = require('../../functions/textToSpeech');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('tts-start')
        .setNameLocalizations({
            'en-US': 'tts-start',
            'ja': '読み上げ開始',
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

            if (!channel) return CustomError(interaction, 'あなたが先にVCに入っている必要があります。');
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Connect)) return BotPermissionError(interaction, 'ボイスチャンネルへの参加');
            if (!channel.type === 'GUILD_STAGE_VOICE') {
                if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Speak)) return BotPermissionError(interaction, 'ボイスチャンネルでの発言');
            };

            await joinVoiceChannel({
                guildId: interaction.guild.id,
                channelId: channel.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfMute: false,
                selfDeaf: true,
            });
            await startTTS(client, interaction.guild.id, interaction.channel.id, channel.id);
            await interaction.followUp({
                content: `🗣️｜<#${interaction.channel.id}> でのチャットを <#${channel.id}> で読み上げます。`
            });
        } catch (error) {
			return InteractionError(interaction, error);
        }
	},
};
