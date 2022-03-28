const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel,  StreamType } = require('@discordjs/voice');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('再生中の曲を終了します。'),
	async execute(interaction, client) {
      const channel = interaction.member.voice.channel;
      if (!channel) return interaction.reply('先にボイスチャンネルに参加してください。');
      const connection = joinVoiceChannel({
         adapterCreator: channel.guild.voiceAdapterCreator,
         channelId: channel.id,
         guildId: channel.guild.id,
         selfDeaf: true,
         selfMute: false,
      });
      const player = createAudioPlayer();
      connection.subscribe(player);
      player.stop();
      await interaction.reply('再生を終了しました。')
      await entersState(player,AudioPlayerStatus.Idle);
	},
};