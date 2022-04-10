const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('music-status')
		.setDescription('曲を再生するステータスを表示します。'),
	async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.reply(`キューに曲がないため表示できません。`)

        const file = new MessageAttachment('D:/folder/Hitrin/bot/js/v1/materials/music.png');
        const embed = new MessageEmbed()
            .setColor('#89c3eb')
            .setAuthor({ name: 'ステータス', iconURL: 'attachment://music.png'})
            .addFields(
                { name: '__**音量:**__', value: `${queue.volume}%`, inline: true },
                { name: '__**加工:**__', value: queue.filters.join(', ') || 'オフ', inline: true },
                { name: '__**リピート:**__', value: queue.repeatMode ? (queue.repeatMode === 2 ? '再生リスト' : '現在の曲') : 'オフ', inline: true },
                { name: '__**自動再生:**__', value: queue.autoplay ? 'オン' : 'オフ', inline: true },
            )
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        await interaction.reply({embeds: [embed], files: [file]})
	},
};