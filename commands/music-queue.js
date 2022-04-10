const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('サーバー再生リストを表示します。'),
	async execute(interaction, client) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('先にボイスチャンネルに参加してください。');
        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT')) return interaction.reply('権限がありません: `CONNECT`');
        if (!permissions.has('SPEAK')) return interaction.reply('権限がありません: `SPEAK`');

        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.reply(`キューに曲がありません。`)
        try {
          const q = queue.songs
            .map((song, i) => `${i === 0 ? '**再生中:**  ' : `**${i}:**  `} [${song.name}](${song.url})`)
            .slice(0, 5)
            .join('\n')
          const file = new MessageAttachment('D:/folder/Hitrin/bot/js/v1/materials/music.png');
          const embed = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('サーバー再生リスト(キュー)')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription(`${q}`)
            .setThumbnail('attachment://music.png')
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
          interaction.reply({embeds: [embed], files: [file]});
        } catch (e) {
          interaction.reply(`エラーが発生しました。`)
        }
	},
};