const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel,  StreamType } = require('@discordjs/voice');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('指定したURLを再生します。')
        .addStringOption(option => option.setName('url').setDescription('再生したい動画のURL')),
	async execute(interaction, client) {
      const url = interaction.options.getString('url');

      if (!ytdl.validateURL(url)) return interaction.reply(`${url} は処理できません。`);
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
      const stream = ytdl(ytdl.getURLVideoID(url), {
         filter: format => format.audioCodec === 'opus' && format.container === 'webm', //webm opus
         quality: 'highest',
         highWaterMark: 32 * 1024 * 1024, // https://github.com/fent/node-ytdl-core/issues/902
      });
      const resource = createAudioResource(stream, {
         inputType: StreamType.WebmOpus
      });
      player.play(resource);
      await interaction.reply(`再生中 ≫ ${url}`)
      await entersState(player,AudioPlayerStatus.Playing);
      await entersState(player,AudioPlayerStatus.Idle);

      setTimeout(function(){
         interaction.channel.send(`<#${channel.id}> から切断しました。`)
         connection.destroy();
      }, 600000);
	},
};

      // function info(interaction, client, invalid) {
      //    const data = ytdl.getInfo(ytdl.getURLVideoID(url));
      //    return data;
      // }
      // const embed = new MessageEmbed()
      //    .setColor('#89c3eb')
      //    .setTitle('再生')
      //    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
      //    .addFields(
      //       { name: '__**タイトル:**__', value: `[${info.player_response.videoDetails.title}](https://www.youtube.com/watch?v=${info.player_response.videoDetails.videoId})` },
      //       { name: '__**チャンネル名:**__', value: `[${info.player_response.videoDetails.author}](https://www.youtube.com/channel/${info.player_response.videoDetails.channelId})` },
      //       { name: '__**長さ:**__', value: info.player_response.videoDetails.lengthSeconds },
      //    )
      //    .setThumbnail(info.player_response.videoDetails.thumbnail.url)
      //    .setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
      //    .setTimestamp();
      // await interaction.reply({ embeds: [embed] });