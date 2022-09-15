const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('unpause')
        .setNameLocalizations({
            'en-US': 'unpause',
            'ja': '一時停止解除',
        })
        .setDescription('Plays the currently paused song.')
        .setDescriptionLocalizations({
            'en-US': 'Plays the currently paused song.',
            'ja': '現在一時停止中の曲を再生します。',
        })
		.setDMPermission(false),

	async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.followUp({ content: '曲を再生していません。'});

        queue.setPaused(false);
        interaction.followUp({
            content: '▶ 再生しました。'
        })
	},
};
