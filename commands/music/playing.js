const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const interactionCreate = require('../../events/interactionCreate');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('playing')
        .setNameLocalizations({
            'en-US': 'playing',
            'ja': '再生中',
        })
        .setDescription('Display information about playing song.')
        .setDescriptionLocalizations({
            'en-US': 'Display information about playing song.',
            'ja': '再生中の曲の詳細を表示します。',
        })
		.setDMPermission(false),

	async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guild.id);
        if (!queue) return interaction.followUp({ content: '曲を再生していません。'});
        const track = queue.nowPlaying();

        var repeat = 'なし';
        if (queue.repeatMode === 1) repeat = 'トラック'
        else if (queue.repeatMode === 2) repeat = 'キュー'
        else if (queue.repeatMode === 3) repeat = '自動再生'

        const songEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            .setTitle(track.title)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .addFields(
                {
                    name: '__**投稿者:**__',
                    value: track.author
                },
                {
                    name: '__**時間:**__',
                    value: track.duration
                },
                {
                    name: '__**プラットフォーム:**__',
                    value: track.source
                },
                {
                    name: '__**設定:**__',
                    value: `**[音量]** ${queue.volume}\n**[モード]** ${repeat}`
                },
                {
                    name: '__**再生地点:**__',
                    value: queue.createProgressBar()
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        interaction.followUp({
            embeds: [songEmbed]
        });
	},
};
