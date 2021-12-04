const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('ヘルプを表示します。'),
	async execute(interaction, client) {
		const u = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('Help')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.addFields(
				{ name: '__**ヘルプ:**__', value: '`help`: ヘルプを表示します。(このコマンド)\n`inquiry <種類> [内容] [対象]`: 運営に依頼や質問等を送信します。' },
				{ name: '__**設定:**__', value: '`set <種類> [任意の文字列]`: BOTに関することを設定します。' },
				{ name: '__**便利:**__', value: '`docs <任意の文字列>`: discord.jsのドキュメントから検索します。\n`info <種類> [対象]`: 指定したものの詳細を表示します。\n`translate <任意の文字列を入力> <翻訳先の言語>`: 任意のテキストを翻訳します。\n`check-url`: Norton Safewebを使って、サイトが危険にさらされているかどうかを確認します' },
				{ name: '__**遊び:**__', value: '`say`: 任意の文字列をボットに言わせます。\n`omikuji`: おみくじを引きます。\n`dice <TIMES> <SIDE>`: ダイスを振ります。\n`balance`: あなたの残金を表示します。\n`get-coin`: コインを受け取るために行動します。(5分に一度)\n`login`: ログイン報酬を受け取ります。(24時間に一度)' },
				{ name: '__**管理:**__', value: '`kick <対象> [理由]`: そのメンバーをサーバーから追放します。\n`ban <対象> [理由] [日数]`: そのメンバーをサーバーから禁止します。\n`unban <対象> [理由]`: そのユーザーの禁止を解除します。' },
			)
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		await interaction.reply({ embeds: [u] });
	},
};