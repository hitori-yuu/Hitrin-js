const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');
const Hypixel = require('hypixel-api-reborn');
const MojangAPI = require('mojang-api');
const date = new Date();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hypixel')
		.setDescription('Use HypixelAPI to retrieve various information.')
        .setDescriptionLocalizations({
            'en-US': 'Use HypixelAPI to retrieve various information.',
            'ja': 'HypixelAPIを使用して様々な情報を取得します。',
        })
		.setDMPermission(true)
		.addSubcommand(subcommand =>
			subcommand
				.setName('player')
				.setNameLocalizations({
					'en-US': 'player',
					'ja': 'プレイヤー',
				})
				.setDescription('Displays information about that player')
				.setDescriptionLocalizations({
					'en-US': 'Displays information about that player',
					'ja': 'プレイヤーの情報を表示。',
				})
				.addStringOption(
					option => option
					.setName('player')
					.setNameLocalizations({
						'en-US': 'player',
						'ja': 'プレイヤー',
					})
					.setDescription('Enter the MCID of that player.')
					.setDescriptionLocalizations({
						'en-US': 'Enter the MCID of that player.',
						'ja': 'プレイヤーのMCIDを入力。',
					})
					.setRequired(true)
				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('guild')
				.setNameLocalizations({
					'en-US': 'guild',
					'ja': 'ギルド',
				})
				.setDescription('Displays information about that guild')
				.setDescriptionLocalizations({
					'en-US': 'Displays information about that guild',
					'ja': 'ギルドの情報を表示。',
				})
				.addStringOption(
					option => option
					.setName('guild')
					.setNameLocalizations({
						'en-US': 'guild',
						'ja': 'ギルド',
					})
					.setDescription('Enter the name of that guild.')
					.setDescriptionLocalizations({
						'en-US': 'Enter the name of that guild.',
						'ja': 'ギルドの名前を入力。',
					})
					.setRequired(true)
				)),

	async execute(interaction) {
		const player = interaction.options.getString('player');
		const guild = interaction.options.getString('guild');
		const hypixel = new Hypixel.Client(process.env.HYPIXEL);

		if (interaction.options.getSubcommand() === 'player') {
			hypixel.getPlayer(player, { guild: true }).then(player => {
				interaction.followUp({
					content: '情報を取得中...'
				}).then(msg => {
					setTimeout(()=> {
						let playerEmbed;
						if (!player.guild) {
							playerEmbed = new EmbedBuilder()
								.setColor('#59b9c6')
								.setTitle(`${player} の詳細`)
								.setThumbnail('https://mineskin.eu/avatar/' + player)
								.addFields(
									{
										name: '__**一般:**__',
										value: `**[表示名]** ${player}\n**[UUID]** ${player.uuid}\n**[ランク]** ${player.rank}`
									},
									{
										name: '__**時間:**__',
										value: `**[初ログイン]** ${new Date(player.firstLogin).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n**[最終ログイン]** ${new Date(player.lastLogin).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
									},
									{
										name: '__**統計:**__',
										value: `**[レベル]** ${player.level}\n**[実績ポイント]** ${player.achievementPoints}`
									},
								)
								.setTimestamp()
								.setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
						} else {
							const guild = player.guild;
							let playerName = player;
							if (guild.tag) playerName = `${player} [${guild.tag}]`;

							playerEmbed = new EmbedBuilder()
								.setColor('#59b9c6')
								.setTitle(`${player} の詳細`)
								.setThumbnail('https://mineskin.eu/avatar/' + player)
								.addFields(
									{
										name: '__**一般:**__',
										value: `**[表示名]** ${playerName}\n**[UUID]** ${player.uuid}\n**[ランク]** ${player.rank}`
									},
									{
										name: '__**時間:**__',
										value: `**[初ログイン]** ${new Date(player.firstLogin).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n**[最終ログイン]** ${new Date(player.lastLogin).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
									},
									{
										name: '__**統計:**__',
										value: `**[レベル]** ${player.level}\n**[実績ポイント]** ${player.achievementPoints}`
									},
									{
										name: '__**ギルド:**__',
										value: `**[名前]** ${guild.name || 'None'}\n**[ID]** ${guild.id}\n**[レベル]** ${guild.level || 'None'}\n**[説明]** ${guild.description || 'None'}`
									},
								)
								.setTimestamp()
								.setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
						}

						msg.edit({
							content: '取得完了しました。',
							embeds: [playerEmbed]
						});
					}, 1000)
				})
			}).catch(error => {
				const error_message = codeBlock('js', error.message);

				console.error('[エラー] コマンド実行中にエラーが発生しました。\n内容: ' + error.message);
				const errorEmbed = new EmbedBuilder()
					.setColor('#d9333f')
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png'}), url: interaction.user.displayAvatarURL({ format: 'png'}) })
					.setDescription('コマンド実行時にエラーが発生しました。\n' + error_message)
					.setTimestamp()
					.setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
				interaction.followUp({
					embeds: [errorEmbed]
				});
				return;
			})
		} else if (interaction.options.getSubcommand() === 'guild') {
			hypixel.getGuild('name', guild).then(guild => {
				var members = [];
				var another = '';
				if (guild.members.length - 10 >= 1) another = `と ${guild.members.length - 10} のメンバー`;

				for (let i = 0; i < 10; i++){
					if (!guild.members[i]) break;
					MojangAPI.profile(guild.members[i].uuid, function(err, res) {
						members.push(res.name)
					});
				};

				interaction.followUp({
					content: '情報を取得中...'
				}).then(msg => {
					setTimeout(()=> {
						const editedEmbed = new EmbedBuilder()
							.setColor('#59b9c6')
							.setTitle(`${guild} の詳細`)
							.setThumbnail('https://dl.labymod.net/img/server/hypixel/icon@2x.png')
							.addFields(
								{
									name: '__**一般:**__',
									value: `**[表示名]** ${guild.name}\n**[ID]** ${guild.id}\n**[説明]** ${guild.description}`
								},
								{
									name: '__**時間:**__',
									value: `**[作成日]** ${new Date(guild.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
								},
								{
									name: '__**統計:**__',
									value: `**[レベル]** ${guild.level}\n**[経験値]** ${guild.experience}\n**[メンバー数]** ${guild.members.length}`
								},
								{
									name: '__**メンバー:**__',
									value: `\`${members.join('`, `') || 'None'}\` ${another}`
								},
							)
							.setTimestamp()
							.setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

						msg.edit({
							content: '取得完了しました。',
							embeds: [editedEmbed]
						});
					}, 2000)
				})
			}).catch(error => {
				const error_message = codeBlock('js', error.message);

				console.error('[エラー] コマンド実行中にエラーが発生しました。\n内容: ' + error.message);
				const errorEmbed = new EmbedBuilder()
					.setColor('#d9333f')
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png'}), url: interaction.user.displayAvatarURL({ format: 'png'}) })
					.setDescription('コマンド実行時にエラーが発生しました。\n' + error_message)
					.setTimestamp()
					.setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
				interaction.followUp({
					embeds: [errorEmbed]
				});
				return;
			})
		}
	},
};

