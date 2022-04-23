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
			.setTitle('ヘルプ')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.addFields(
				{ name: '__**ヘルプ:**__', value: '`help`: ヘルプを表示します。(このコマンド)\n`inquiry <種類> [内容] [対象]`: 運営に依頼や質問等を送信します。' },
				{ name: '__**設定:**__', value: '`set`: BOTに関することを設定します。\n`music-set`: 曲の再生に関する設定をします。' },
				{ name: '__**便利:**__', value: '`docs <検索>`: discord.jsのドキュメントから検索します。\n`info <種類> [対象]`: 指定したものの詳細を表示します。\n`translate <翻訳したいテキスト> <翻訳先の言語>`: 任意のテキストを翻訳します。\n`check-url` <URLまたはドメイン名>: Norton Safewebを使って、サイトが危険にさらされているかどうかを確認します\n`weather <地名> <日付> <温度の種類>`: 指定した地域の天気の詳細を表示します。（現在または明日）`join`: あなたが参加しているボイスチャンネルに参加します。\n`leave`: 参加しているボイスチャンネルから切断します。' },
				{ name: '__**遊び:**__', value: '`profile`: プロフィール関連コマンド\n`together <チャンネル> <アクティビティの種類>`: 指定したチャンネルにて任意のアクティビティを開始します。\n`say <言わせたい言葉>`: 任意の文字列をボットに言わせます。\n`omikuji`: おみくじを引きます。\n`dice <回数> <面数>`: ダイスを振ります。\n`balance`: あなたの残金を表示します。\n`get-coin`: コインを受け取るために行動します。(5分に一度)\n`login`: ログイン報酬を受け取ります。(24時間に一度)' },
				{ name: '__**管理:**__', value: '`kick <対象> [理由]`: そのメンバーをサーバーから追放します。\n`ban <対象> [理由] [日数]`: そのメンバーをサーバーから禁止します。\n`unban <対象> [理由]`: そのユーザーの禁止を解除します。' },
				{ name: '__**音楽:**__', value: '`play <検索>`: 指定したURLの動画または検索した動画を再生します。\n`stop`: 再生中の曲を停止します。\n`skip`: 再生中の曲をスキップします。\n`queue`: サーバー再生リストを表示します。\n`pause`: 再生中の曲一時停止します。\n`remuse`: 一時停止中の曲を再生します。\n`music-status`: 曲を再生するステータスを表示します。\n`music-set`: 曲の再生に関する設定をします。' },
			)
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		await interaction.reply({ embeds: [u] });
	},
};