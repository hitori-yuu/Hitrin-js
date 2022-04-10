const { SlashCommandBuilder } = require('@discordjs/builders');
const { entersState, AudioPlayerStatus, createAudioPlayer, joinVoiceChannel,  StreamType } = require('@discordjs/voice');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('あなたが参加しているボイスチャンネルに参加します。'),
	async execute(interaction, client) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('先にボイスチャンネルに参加してください。');
        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT')) return interaction.reply('権限がありません: `CONNECT`');
        if (!permissions.has('SPEAK')) return interaction.reply('権限がありません: `SPEAK`');
        const connection = joinVoiceChannel({
            adapterCreator: channel.guild.voiceAdapterCreator,
            channelId: channel.id,
            guildId: channel.guild.id,
            selfDeaf: true,
            selfMute: false,
        });
        const player = createAudioPlayer();
        connection.subscribe(player);
        client.distube.voices.join(channel)
		await interaction.reply(`<#${channel.id}> に参加しました。`);
	},
};