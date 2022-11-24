const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require("@discordjs/voice");
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
            if (!channel.joinable) return BotPermissionError(interaction, 'ボイスチャンネルへの参加');
            if (!channel.type === 'GUILD_STAGE_VOICE') {
                if (!channel.speakable) return BotPermissionError(interaction, 'ボイスチャンネルでの再生');
            };

            await joinVoiceChannel({
                guildId: interaction.guild.id,
                channelId: channel.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfMute: false,
                selfDeaf: true,
            });
            await interaction.client.voiceChannels.set(channel.id, interaction.channel.id);
            await interaction.client.voiceGuilds.set(interaction.guild.id, channel.id);
            await interaction.followUp({
                content: `🗣️｜<#${interaction.channel.id}> でのチャットを <#${channel.id}> で読み上げます。`
            });
        } catch (error) {
			return InteractionError(error, interaction);
        }
	},
};
