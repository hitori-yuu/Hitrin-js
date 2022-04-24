const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return;
        if (interaction.customId === 'help_select') {
            const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('help_select')
                    .setPlaceholder('表示したいカテゴリを選択')
                    .addOptions([
                        {
                            label: 'ヘルプ',
                            description: '「ヘルプ」カテゴリを表示',
                            value: 'select_help',
                        },
                        {
                            label: '設定',
                            description: '「設定」カテゴリを表示',
                            value: 'select_set',
                        },
                        {
                            label: '便利',
                            description: '「便利」カテゴリを表示',
                            value: 'select_useful',
                        },
                        {
                            label: '遊び',
                            description: '「遊び」カテゴリを表示',
                            value: 'select_game',
                        },
                        {
                            label: '管理',
                            description: '「管理」カテゴリを表示',
                            value: 'select_management',
                        },
                        {
                            label: '音楽',
                            description: '「音楽」カテゴリを表示',
                            value: 'select_music',
                        },
                    ]),
            );

        const help = new MessageEmbed()
                .setColor('#89c3eb')
                .setTitle('ヘルプ―ヘルプ')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
                .addFields(
                    { name: '__**ヘルプ:**__', value: '`help`: ヘルプを表示します。(このコマンド)\n`inquiry <種類> [内容] [対象]`: 運営に依頼や質問等を送信します。' },
                )
                .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
                .setTimestamp();

            const set = new MessageEmbed()
                .setColor('#89c3eb')
                .setTitle('ヘルプ―設定')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
                .addFields(
                    { name: '__**設定:**__', value: '`set`: BOTに関することを設定します。\n`music-set`: 曲の再生に関する設定をします。' },
                )
                .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
                .setTimestamp();

            const useful = new MessageEmbed()
                .setColor('#89c3eb')
                .setTitle('ヘルプ―便利')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
                .addFields(
                    { name: '__**便利:**__', value: '`docs <検索>`: discord.jsのドキュメントから検索します。\n`info <種類> [対象]`: 指定したものの詳細を表示します。\n`translate <翻訳したいテキスト> <翻訳先の言語>`: 任意のテキストを翻訳します。\n`check-url` <URLまたはドメイン名>: Norton Safewebを使って、サイトが危険にさらされているかどうかを確認します\n`weather <地名> <日付> <温度の種類>`: 指定した地域の天気の詳細を表示します。（現在または明日）\n`join`: あなたが参加しているボイスチャンネルに参加します。\n`leave`: 参加しているボイスチャンネルから切断します。' },
                )
                .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
                .setTimestamp();

            const game = new MessageEmbed()
                .setColor('#89c3eb')
                .setTitle('ヘルプ―遊び')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
                .addFields(
                    { name: '__**遊び:**__', value: '`profile`: プロフィール関連コマンド\n`together <チャンネル> <アクティビティの種類>`: 指定したチャンネルにて任意のアクティビティを開始します。\n`say <言わせたい言葉>`: 任意の文字列をボットに言わせます。\n`omikuji`: おみくじを引きます。\n`dice <回数> <面数>`: ダイスを振ります。\n`balance`: あなたの残金を表示します。\n`get-coin <行動の種類>`: コインを受け取るために行動します。(5分に一度)\n`login`: ログイン報酬を受け取ります。(24時間に一度)' },
                )
                .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
                .setTimestamp();

            const management = new MessageEmbed()
                .setColor('#89c3eb')
                .setTitle('ヘルプ―管理')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
                .addFields(
                    { name: '__**管理:**__', value: '`kick <対象> [理由]`: そのメンバーをサーバーから追放します。\n`ban <対象> [理由] [日数]`: そのメンバーをサーバーから禁止します。\n`unban <対象> [理由]`: そのユーザーの禁止を解除します。' },
                )
                .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
                .setTimestamp();

            const music = new MessageEmbed()
                .setColor('#89c3eb')
                .setTitle('ヘルプ―音楽')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
                .addFields(
                    { name: '__**音楽:**__', value: '`play <検索>`: 指定したURLの動画または検索した動画を再生します。\n`stop`: 再生中の曲を停止します。\n`skip`: 再生中の曲をスキップします。\n`queue`: サーバー再生リストを表示します。\n`pause`: 再生中の曲一時停止します。\n`remuse`: 一時停止中の曲を再生します。\n`music-status`: 曲を再生するステータスを表示します。\n`music-set`: 曲の再生に関する設定をします。' },
                )
                .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
                .setTimestamp();

            const value = interaction.values[0]
            switch (value) {
                case 'select_help':
                    await interaction.update({ embeds: [help] });
                    break;
                case 'select_set':
                    await interaction.update({ embeds: [set] });
                    break;
                case 'select_useful':
                    await interaction.update({ embeds: [useful] });
                    break;
                case 'select_game':
                    await interaction.update({ embeds: [game] });
                    break;
                case 'select_management':
                    await interaction.update({ embeds: [management] });
                    break;
                case 'select_music':
                    await interaction.update({ embeds: [music] });
                    break;
                }

		}
	},
};