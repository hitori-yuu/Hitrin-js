const fs = require('fs');
const { Client, Collection, MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require('discord.js');
const { codeBlock } = require('@discordjs/builders');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require("@distube/yt-dlp");
const mongoose = require('mongoose');
require('dotenv').config();
const profileModel = require('./models/profileSchema');
const guildsModel = require('./models/guildsSchema');


const options = {
	intents: ['GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES'],
};

const client = new Client(options);
client.distube = new DisTube(client, {
	leaveOnStop: false,
	searchSongs: 5,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: false,
	emitAddListWhenCreatingQueue: false,
	youtubeDL: true,
	plugins: [new YtDlpPlugin()],
})


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

mongoose
	.connect(process.env.MONGODB, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('[起動] データベース接続完了');
	})
	.catch((error) => {
		console.error('[異常]\n' + error)
	});

client.on('interactionCreate', async interaction => {
	let profileData;
	let guildsData;
	const tos_ok = new MessageButton()
		.setCustomId('tos_ok')
		.setStyle('SUCCESS')
		.setLabel('同意');
	const tos_no = new MessageButton()
		.setCustomId('tos_no')
		.setStyle('DANGER')
		.setLabel('同意しない');

	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		profileData = await profileModel.findOne({ _id: interaction.user.id });
		guildsData = await guildsModel.findOne({ _id: interaction.guild.id });
		if (!guildsData) {
			const guild = await guildsModel.create({
				_id: interaction.guild.id,
				ownerID: interaction.guild.ownerId,
				welcomeCh: 'none',
				settings: {
					autoMod: true,
					autoPublish: true,
					globalBan: true,
					log: 'none',
					level: 'normal',
				}
			});
			const initial_guild = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('InitialSettings')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.setDescription(`**[_id]** ${interaction.guild.id}\n**[OwnerId]** ${interaction.guild.ownerId}\n**[GlobalBAN]** true\n**[AutoMod]** true\n**[Setting]** \n__Log:__ None\n__Level:__ normal`)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			guild.save();
			console.log('[設定] サーバー初期設定が完了しました: ' + interaction.guild.name);
			client.channels.cache.get('879943806118678528').send({ embeds: [initial_guild] });
		}
		if (!profileData) {
			const tos = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('利用規約等への同意が必要です。')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.setDescription('[Bot利用規約](https://hitori-yuu.github.io/Hitrin-web/terms.html)\n[プライバシーポリシー](https://hitori-yuu.github.io/Hitrin-web/privacy.html)')
				.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			const profile = await profileModel.create({
				_id: interaction.user.id,
				name: interaction.user.username,
				avatar: interaction.user.displayAvatarURL({ format: 'png' }),
				color: 'DEFAULT',
				birthday: {
					date: null,
					public: false,
				},
				description: null,
				evaluation: 10,
				coins: 1000,
				tos: false,
			});
			profile.save();
			const initial_profile = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('InitialSettings')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.setDescription(`**[_id]** ${interaction.user.id}\n**[Evaluation]** 10\n**[Coins]** 1000\n**[Avatar]** [URL](${interaction.user.displayAvatarURL({ format: 'png' })})\n**[Description]** None\n**[Birthday]** None`)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			console.log('[設定] メンバー初期設定が完了しました: ' + interaction.user.tag);
			client.channels.cache.get('879943806118678528').send({ embeds: [initial_profile] });
			return interaction.reply({ embeds: [tos], components: [new MessageActionRow().addComponents([tos_ok, tos_no])] });
		}
		if (profileData && !profileData.tos) {
			const tos = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('利用規約等への同意が必要です。')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.setDescription('[Bot利用規約](https://hitori-yuu.github.io/Hitrin-web/terms.html)\n[プライバシーポリシー](https://hitori-yuu.github.io/Hitrin-web/privacy.html)')
				.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			return interaction.reply({ embeds: [tos], components: [new MessageActionRow().addComponents([tos_ok, tos_no])] });
		}

		await command.execute(interaction, client);
		const profile = await profileModel.findOneAndUpdate(
			{
				_id: interaction.user.id,
			},
			{
				$inc: {
					coins: 2,
				},
			},
		);
		profile.save();
	}
	catch (error) {
		return console.error('[異常]\n' + error), error_unknown(interaction, error);
	}
});

const file = new MessageAttachment('D:/folder/Hitrin/bot/js/v1/materials/music.png');

const play = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('stop')
			.setStyle('PRIMARY')
			.setLabel('⏹'),
		new MessageButton()
			.setCustomId('pause_resume')
			.setStyle('PRIMARY')
			.setLabel('⏯'),
		new MessageButton()
			.setCustomId('skip')
			.setStyle('PRIMARY')
			.setLabel('⏭'),
		new MessageButton()
			.setCustomId('repeat')
			.setStyle('PRIMARY')
			.setLabel('🔁'),
		new MessageButton()
			.setCustomId('status')
			.setStyle('PRIMARY')
			.setLabel('⏏')
);

const add = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('stop')
			.setStyle('PRIMARY')
			.setLabel('⏹'),
		new MessageButton()
			.setCustomId('skip')
			.setStyle('PRIMARY')
			.setLabel('⏭'),
		new MessageButton()
			.setCustomId('repeat')
			.setStyle('PRIMARY')
			.setLabel('🔁'),
		new MessageButton()
			.setCustomId('status')
			.setStyle('PRIMARY')
			.setLabel('⏏')
);


client.distube
	.on('initQueue', (queue) => {
    	queue.autoplay = true;
    	queue.volume = 25;
	})
	.on('playSong', (queue, song) => {
		const playing = new MessageEmbed()
			.setColor('#89c3eb')
			.setAuthor({ name: '再生中', iconURL: 'attachment://music.png'})
			.setDescription(`[${song.name}](${song.url})`)
			.addFields(
				{ name: '__**投稿者:**__', value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
				{ name: '__**長さ:**__', value: song.formattedDuration, inline: true },
				{ name: '__**再生:**__', value: song.user.tag, inline: true },
			)
			.setThumbnail(song.thumbnail)
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		queue.textChannel.send({embeds: [playing], files: [file], components: [play]});
	})
  	.on('addSong', (queue, song) =>{
		const addsong = new MessageEmbed()
			.setColor('#89c3eb')
			.setAuthor({ name: '再生リストに追加', iconURL: 'attachment://music.png'})
			.setDescription(`[${song.name}](${song.url})`)
			.addFields(
				{ name: '__**投稿者:**__', value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
				{ name: '__**長さ:**__', value: song.formattedDuration, inline: true },
				{ name: '__**再生:**__', value: song.user.tag, inline: true },
			)
			.setThumbnail(song.thumbnail)
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		queue.textChannel.send({embeds: [addsong], files: [file], components: [add]});
	})
  	.on('addList', (queue, playlist) => {
	  	const addlist = new MessageEmbed()
			.setColor('#89c3eb')
			.setAuthor({ name: '再生リストに追加(プレイリスト)', iconURL: 'attachment://music.png'})
			.setDescription(`[${playlist.name}](${playlist.url})`)
			.addFields(
				{ name: '__**投稿者:**__', value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
				{ name: '__**動画数:**__', value: playlist.songs.length, inline: true },
				{ name: '__**再生:**__', value: song.user.tag, inline: true },
			)
			.setThumbnail(song.thumbnail)
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		queue.textChannel.send({embeds: [addlist], files: [file], components: [add]});
 	})
	.on('error', (channel, e) => {
		channel.send('エラーが発生しました。')
		console.error('[異常]\n' + e)
	})
	.on('empty', channel => channel.send('ボイスチャンネルに誰もいないため退出します。'))
	.on('searchNoResult', (interaction, query) =>
		interaction.channel.send(`該当する結果は見つかりませんでした。 \`${query}\`!`)
	)
	.on('finish', queue => queue.textChannel.send('再生が終了しました。'))
	.on('disconnect', queue =>
		queue.textChannel.send('切断しました。'),
	)
	.on('searchResult', (interaction, result) => {
        let i = 0
        interaction.channel.send(
            `**下記の中から1つ選んでください。**\n${result
                .map(
                    song =>
                        `**${++i}:**  [${song.name}](${song.url}) - \`${
                            song.formattedDuration
                        }\``,
                )
                .join(
                    '\n',
                )}\n*他に何か入力するか、30秒待つとキャンセルされます*`,
        )
    })
    .on('searchCancel', interaction =>
        interaction.channel.send('検索をキャンセルしました。'),
    )
    .on('searchInvalidAnswer', interaction =>
        interaction.channel.send('無効な数字を入力しました。'),
    )
    .on('searchNoResult', interaction =>
        interaction.channel.send('該当する結果は見つかりませんでした。'),
    )
    .on('searchDone', () => {})

function error_unknown(interaction, error) {
	const err = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription('無知のエラーが発生しました。既に開発者に報告されています。')
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	const error_log = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('エラー')
		.setDescription('【エラー内容】\n' + codeBlock('js', error))
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	const log = client.channels.cache.get('919599721184628807').send({ embeds: [error_log] });
	return interaction.reply({ embeds: [err] }), log;
}

client.login(process.env.TOKEN);