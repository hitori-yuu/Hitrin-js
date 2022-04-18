const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('一時停止中の曲を再生します。'),
	async execute(interaction, client) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('先にボイスチャンネルに参加してください。');
        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT')) return interaction.reply('権限がありません: `CONNECT`');
        if (!permissions.has('SPEAK')) return interaction.reply('権限がありません: `SPEAK`');

        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.reply('キューに曲がありません。')
        queue.resume()
        await interaction.reply('一時停止中の曲を再生します。')
	},
};