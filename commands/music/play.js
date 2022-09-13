const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('play')
        .setNameLocalizations({
            'en-US': 'play',
            'ja': '再生',
        })
        .setDescription('Searches for and plays the specified URL or song title.')
        .setDescriptionLocalizations({
            'en-US': 'Searches for and plays the specified URL or song title.',
            'ja': '指定したURLまたは曲名を検索し再生します。',
        })
		.setDMPermission(false)
        .addStringOption(
            option => option
            .setName('query')
            .setNameLocalizations({
                'en-US': 'query',
                'ja': '検索',
            })
            .setDescription('Enter the name of song or the URL.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the name of song or the URL.',
                'ja': 'URLまたは曲名を入力。',
            })
        ),

	async execute(interaction) {
        const query = interaction.options.getString('query');
        const channel = interaction.member.voice.channel;

        if (!channel) return interaction.followUp({ content: 'あなたが先にVCに入っている必要があります。' });
        if (!channel.joinable) return interaction.followUp({ content: 'VCに参加する権限がありません。' });
        if (!channel.speakable) return interaction.followUp({ content: 'VCで音声を再生する権限がありません。' });

        const track = await interaction.client.player
        .search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        })
        .catch(() => {});

        const queue = interaction.client.player.createQueue(interaction.guild, {
            leaveOnEnd: false,
            leaveOnStop: false,
            volumeSmoothness: 5,
            metadata: { channel: interaction.channel },
        });

        const failedEmbed = new EmbedBuilder()
            .setColor('#d9333f')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            .setDescription(`**${query}** は見つかりませんでした。`)
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const youtubeEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            .setTitle(track.tracks[0].title)
            .setURL(track.tracks[0].url)
            .setThumbnail(track.tracks[0].thumbnail)
            .addFields(
                {
                    name: '__**投稿者:**__',
                    value: track.tracks[0].author
                },
                {
                    name: '__**統計:**__',
                    value: `**[時間]** ${track.tracks[0].duration}\n**[視聴回数]** ${parseInt(track.tracks[0].views / 1000)}k 回視聴`
                },
                {
                    name: '__**プラットフォーム:**__',
                    value: track.tracks[0].source
                }
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
        const spotifyEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            .setTitle(track.tracks[0].title)
            .setURL(track.tracks[0].url)
            .setThumbnail(track.tracks[0].thumbnail)
            .addFields(
                {
                    name: '__**投稿者:**__',
                    value: track.tracks[0].author
                },
                {
                    name: '__**プラットフォーム:**__',
                    value: track.tracks[0].source
                }
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        try {
            if (!queue.connection) await queue.connect(channel);
            if (!track) return interaction.followUp({ embeds: failedEmbed });
            if (track.tracks[0].source === 'youtube') {
                interaction.followUp({
                    embeds: [youtubeEmbed]
                });
            } else if (track.tracks[0].source === 'spotify') {
                interaction.followUp({
                    embeds: [spotifyEmbed]
                });
            }
            track.playlist ? queue.addTracks(track.tracks) : queue.addTrack(track.tracks[0]);
            if (!queue.playing) await queue.play();
            if (interaction.client.player.getQueue(interaction.guild.id).repeatMode === 0) queue.setRepeatMode(3);
        } catch {
            queue.destroy();
            const failedEmbed = new EmbedBuilder()
                .setColor('#d9333f')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setDescription('ボイスチャンネルに参加できません。')
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
            return interaction.reply({ embeds: [failedEmbed] });
        }
	},
};
