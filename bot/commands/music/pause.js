const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('pause')
        .setNameLocalizations({
            'en-US': 'pause',
            'ja': '一時停止',
        })
        .setDescription('Pause the currently playing song.')
        .setDescriptionLocalizations({
            'en-US': 'Pause the currently playing song.',
            'ja': '現在再生中の曲を一時停止します。',
        })
		.setDMPermission(false),

	async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.followUp({ content: '曲を再生していません。'});

        queue.setPaused(true);
        interaction.followUp({
            content: '⏸ 一時停止しました。'
        })
	},
};
