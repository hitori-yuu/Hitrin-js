const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('music-set')
		.setDescription('曲の再生に関する設定をします。')
		.addSubcommand(subcommand => subcommand.setName('volume').setDescription('音量を設定します。').addNumberOption(option => option.setName('音量').setDescription('1~100の範囲で入力 ※体感では入力した音量 +70 くらいです。').setRequired(true)))
		.addSubcommand(subcommand => subcommand.setName('filter').setDescription('曲にかける加工を設定します。').addStringOption(option => option.setName('種類').setDescription('1つ選択').addChoice('3D', '3d').addChoice('BASS BOOST', 'bassboost').addChoice('Echo', 'echo').addChoice('カラオケ', 'karaoke').addChoice('Nightcore', 'nightcore').addChoice('Vaporwave', 'vaporwave').setRequired(true)))
		.addSubcommand(subcommand => subcommand.setName('repeat').setDescription('リピートを設定します。').addStringOption(option => option.setName('リピートの種類').setDescription('1つを選択').addChoice('再生リスト', 'list').addChoice('曲', 'song').addChoice('オフ', 'off').setRequired(true)))
		.addSubcommand(subcommand => subcommand.setName('autoplay').setDescription('自動再生を設定します。')),
	async execute(interaction, client) {
		const volume = interaction.options.getNumber('音量');
		const type = interaction.options.getString('種類');
		const loop_type = interaction.options.getString('リピートの種類');

		if (!interaction.options.getSubcommand()) return error_invalid(interaction, client, 'サブコマンド')

        if (interaction.options.getSubcommand() === 'volume') {
			if (volume < 1 || volume > 100) return interaction.reply('1~100の範囲で指定してください。')
			client.distube.setVolume(interaction, volume);
			await interaction.reply(`音量の設定: \`${volume}\``)
        }
		else if (interaction.options.getSubcommand() === 'filter') {
			const filters = client.distube.setFilter(interaction, type);
			await interaction.reply(`加工の設定: \`${filters || 'オフ'}\``)
        }
		else if (interaction.options.getSubcommand() === 'repeat') {
			let mode;
			switch(loop_type) {
				case 'list':
					client.distube.setRepeatMode(interaction, 2)
					mode = 'リスト全体'
					break;
				case 'song':
					client.distube.setRepeatMode(interaction, 1)
					mode = '曲'
					break;
				case 'off':
					client.distube.setRepeatMode(interaction, 0)
					mode = 'オフ'
					break;
			}
			await interaction.reply(`リピートの設定: \`${mode}\``)
        }
		else if (interaction.options.getSubcommand() === 'autoplay') {
			client.distube.toggleAutoplay(interaction);
			const mode = client.distube.toggleAutoplay(interaction);
			await interaction.reply(`自動再生の設定: \`${mode ? 'オン' : 'オフ'}\``);
        }

		const queue = client.distube.getQueue(interaction)
		if (!queue) return interaction.reply('キューに曲がないため表示できません。')
		const file = new MessageAttachment('D:/folder/Hitrin/bot/js/v1/materials/music.png');
		const embed = new MessageEmbed()
			.setColor('#89c3eb')
			.setAuthor({ name: 'ステータス', iconURL: 'attachment://music.png'})
			.addFields(
				{ name: '__**音量:**__', value: `${queue.volume}%`, inline: true },
				{ name: '__**リピート:**__', value: queue.repeatMode ? (queue.repeatMode === 2 ? 'キュー全体' : '現在の曲') : 'オフ', inline: true },
				{ name: '__**自動再生:**__', value: queue.autoplay ? 'オン' : 'オフ', inline: true },
				{ name: '__**加工:**__', value: queue.filters.join(', ') || 'オフ', inline: false },
			)
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		await interaction.channel.send({embeds: [embed], files: [file]})
	},
};

function error_invalid(interaction, client, invalid) {
	const error = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription(`実行に必須なパラメータが無効です: \`${invalid || 'None'}\``)
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	return interaction.reply({ embeds: [error] });
}