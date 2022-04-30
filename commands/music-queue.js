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
    if (!permissions.has('CONNECT')) return error_permission(interaction, client, 'CONNECT')
    if (!permissions.has('SPEAK')) return error_permission(interaction, client, 'SPEAK')

    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply('キューに曲がありません。')
    const q = queue.songs
      .map((song, i) => `${i === 0 ? '**再生中:**  ' : `**${i}:**  `} [${song.name}](${song.url})`)
      .slice(0, 5)
      .join('\n')
    const file = new MessageAttachment('D:/folder/Hitrin/bot/js/v1/materials/music.png');
    const embed = new MessageEmbed()
      .setColor('#89c3eb')
      .setTitle('サーバー再生リスト(キュー)')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
      .setDescription(q)
      .setThumbnail('attachment://music.png')
      .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
      .setTimestamp();
    await interaction.reply({embeds: [embed], files: [file]});
	},
};

function error_permission(interaction, client, permission) {
	const error = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription(`実行に必須な権限がありません: \`${permission || 'None'}\``)
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	return interaction.reply({ embeds: [error] });
}