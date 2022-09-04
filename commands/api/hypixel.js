const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Hypixel = require('hypixel-api-reborn');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hypixel')
		.setDescription('Displays information about that player in Hypixel.')
        .setDescriptionLocalizations({
            'en-US': 'Displays information about that player in Hypixel.',
            'ja': '指定したプレイヤーのHypixel内での情報を表示します。',
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
        ),

	async execute(interaction) {
		const player = interaction.options.getString('player');
		const hypixel = new Hypixel.Client(process.env.HYPIXEL);


		hypixel.getPlayer(player, { guild: true }).then(player => {
			const guild = player.guild;
			let playerName = player.nickname;
			if (guild.tag) playerName = `${player.nickname}*[${guild.tag}]*`;

			const playerEmbed = new EmbedBuilder()
				.setColor('#59b9c6')
				.setTitle(`${player} の詳細`)
				.setThumbnail('https://mineskin.eu/avatar/' + player.nickname)
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
						value: `**[名前]** ${guild.name}\n**[ID]** ${guild.id}\n**[レベル]** ${guild.level}\n**[説明]** ${guild.description}`
					},
				)
				.setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

			console.log(player.guild);
			interaction.followUp({
				embeds: [playerEmbed]
			});
		});
	},
};
