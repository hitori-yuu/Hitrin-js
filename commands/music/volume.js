const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('volume')
        .setNameLocalizations({
            'en-US': 'volume',
            'ja': '音量',
        })
        .setDescription('Set the volume.')
        .setDescriptionLocalizations({
            'en-US': 'Set the volume.',
            'ja': '現在再生中の曲を一時停止します。',
        })
		.setDMPermission(false)
        .addNumberOption(
            option => option
            .setName('volume')
            .setNameLocalizations({
                'en-US': 'volume',
                'ja': '音量',
            })
            .setDescription('Enter volume as a number.')
            .setDescriptionLocalizations({
                'en-US': 'Enter volume as a number.',
                'ja': '音量を数字で入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
        const volume = interaction.options.getNumber('volume');
        const queue = interaction.client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.followUp({ content: '曲を再生していません。'});
        if (volume < 0) return interaction.followUp({ content: '音量は0以上にして下さい。' });

        queue.setVolume(volume);
        interaction.followUp({
            content: `🔉 音量を \`${volume}\` に設定しました。`
        });
	},
};
