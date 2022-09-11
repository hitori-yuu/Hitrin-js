const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('stop')
        .setNameLocalizations({
            'en-US': 'stop',
            'ja': '停止',
        })
        .setDescription('Stops song playback.')
        .setDescriptionLocalizations({
            'en-US': 'Stops song playback.',
            'ja': '再生を停止します。',
        })
		.setDMPermission(false),

	async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.followUp({ content: '曲を再生していません。'});

        queue.destroy();
        interaction.followUp({
            content: '⏹ 停止しました。'
        })
	},
};
