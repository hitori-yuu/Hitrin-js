const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('repeat')
        .setNameLocalizations({
            'en-US': 'repeat',
            'ja': 'リピート',
        })
        .setDescription('Set the repeat mode.')
        .setDescriptionLocalizations({
            'en-US': 'Set the repeat mode.',
            'ja': '現在再生中の曲を一時停止します。',
        })
		.setDMPermission(false)
        .addNumberOption(
            option => option
            .setName('mode')
            .setNameLocalizations({
                'en-US': 'mode',
                'ja': 'モード',
            })
            .setDescription('Select the type of repeat mode.')
            .setDescriptionLocalizations({
                'en-US': 'Select the type of repeat mode.',
                'ja': 'リピートのモードの種類を選択。',
            })
            .addChoices(
				{ name: 'オフ', value: 0 },
                { name: 'トラック', value: 1 },
                { name: 'キュー', value: 2 },
                { name: '自動再生', value: 3 },
			)
            .setRequired(true)
        ),

	async execute(interaction) {
        const mode = interaction.options.getNumber('mode');
        const queue = interaction.client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.followUp({ content: '曲を再生していません。'});


        var modeName = 'オフ';
        if (mode === 0) {
            modeName = 'オフ';
        } else if (mode === 1) {
            modeName = 'トラック';
        } else if (mode === 2) {
            modeName = 'キュー';
        } else if (mode === 3) {
            modeName = '自動再生';
        }

        queue.setRepeatMode(mode);
        interaction.followUp({
            content: `リピートモードを \`${modeName}\` に設定しました。`
        })
	},
};
