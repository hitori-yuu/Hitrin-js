const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('skip')
        .setNameLocalizations({
            'en-US': 'skip',
            'ja': 'スキップ',
        })
        .setDescription('Skips the currently playing song.')
        .setDescriptionLocalizations({
            'en-US': 'Skips the currently playing song.',
            'ja': '現在再生中の曲をスキップします。',
        })
		.setDMPermission(false)
        .addNumberOption(
            option => option
            .setName('track')
            .setNameLocalizations({
                'en-US': 'track',
                'ja': 'トラック',
            })
            .setDescription('Enter the number of track.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the number of track.',
                'ja': 'トラックの番号を入力。',
            })
        ),

	async execute(interaction) {
        const track = interaction.options.getNumber('track');
        const queue = interaction.client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.followUp({ content: '曲を再生していません。'});

        if (track < queue.tracks.length) {
            queue.skipTo(track - 1);
            interaction.followUp({
                content: `⏭ \`${track}番目\` のトラックまでスキップしました。`
            })
        } else if (!track) {
            queue.skip();
            interaction.followUp({
                content: '⏭ スキップしました。'
            })
        } else {
            return interaction.followUp({ content: '無効なトラックです' });
        }
	},
};
