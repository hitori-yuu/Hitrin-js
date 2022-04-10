const { SlashCommandBuilder } = require('@discordjs/builders');
const { entersState, AudioPlayerStatus, createAudioPlayer, joinVoiceChannel,  StreamType } = require('@discordjs/voice');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('参加しているボイスチャンネルから切断します。'),
	async execute(interaction, client) {
        const channel = interaction.guild.me.voice.channel;
        if (!channel) return interaction.reply('ボイスチャンネルに参加していません。');
		const connection = joinVoiceChannel({
            adapterCreator: channel.guild.voiceAdapterCreator,
            channelId: channel.id,
            guildId: channel.guild.id,
            selfDeaf: true,
            selfMute: false,
        });
		connection.disconnect();
        client.distube.voices.leave(interaction)
		await interaction.reply(`<#${channel.id}> から切断しました。`);
	},
};