const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('指定したURLの動画または検索した動画を再生します。')
		.addStringOption(option => option.setName('検索').setDescription('再生したい動画のURLまたは検索ワード')),
	async execute(interaction, client) {
		const arg = interaction.options.getString('検索');
        if (!arg) return interaction.reply('未入力: `検索`')

        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('先にボイスチャンネルに参加してください。');
        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT')) return interaction.reply('権限がありません: `CONNECT`');
        if (!permissions.has('SPEAK')) return interaction.reply('権限がありません: `SPEAK`');

        try {
            client.distube.play(channel, arg, {
                member: interaction.member,
                textChannel: interaction.channel,
                interaction
            })
            const queue = client.distube.getQueue(interaction)
            if (!queue) interaction.reply('再生します。')
            if (queue) interaction.reply('再生リストに追加しました。')
        } catch (e) {
            interaction.reply(`エラーが発生しました。`)
        }
	},
};