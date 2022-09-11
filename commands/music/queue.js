const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('queue')
        .setNameLocalizations({
            'en-US': 'queue',
            'ja': 'キュー',
        })
        .setDescription('Display the queue.')
        .setDescriptionLocalizations({
            'en-US': 'Display the queue.',
            'ja': 'キューを表示します。',
        })
		.setDMPermission(false)
        .addStringOption(
            option => option
            .setName('type')
            .setNameLocalizations({
                'en-US': 'type',
                'ja': '種類',
            })
            .setDescription('Select the type of execution.')
            .setDescriptionLocalizations({
                'en-US': 'Select the type of execution.',
                'ja': '実行する種類を選択。',
            })
			.addChoices(
				{ name: '表示', value: 'show' },
				{ name: 'クリア', value: 'clear' },
			)
            .setRequired(true)
        ),

	async execute(interaction) {
        const type = interaction.options.getString('type');
        const queue = interaction.client.player.getQueue(interaction.guild.id);
        const tracks = [];
        if (!queue) return interaction.followUp({ content: '曲を再生していません。'});

        if (type == 'show') {
            var playing = queue.nowPlaying();
            var playingSong = 'None'
            if (playing) playingSong = `[${playing.title}](${playing.url})`

            for (let i = 0; i < queue.tracks.length; i++) {
                tracks.push(`**${i + 1}:** [${queue.tracks[i].title}](${queue.tracks[i].url}) \`${queue.tracks[i].duration}\``)
                if (i === 9) break;
            }

            const trackEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setTitle('現在のキュー')
                .setThumbnail(playing.thumbnail)
                .setDescription(`▶ ${playingSong}\n\n${tracks.join('\n')}` || 'None')
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            interaction.followUp({
                embeds: [trackEmbed]
            });
        } else if (type == 'clear') {
            const clearEmbed = new EmbedBuilder()
                .setColor('#93ca76')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setDescription(`キューをクリアしました。`)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            interaction.client.player.deleteQueue(interaction.guild.id);
            interaction.followUp({
                embeds: [clearEmbed]
            });
        }
	},
};
