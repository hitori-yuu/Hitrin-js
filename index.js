const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config()

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
	],
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	],
});

client.player = new Player(client, {
	ytdlOptions: {
		quality: "highest",
		filter: "audioonly",
		highWaterMark: 1 << 25,
		dlChunkSize: 0,
	},
});

client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.voiceChannels = new Collection();

// データベース
mongoose //mongooseについて
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('データベースに接続しました。');
	})
	.catch((error) => {
		console.error('[エラー] ボット起動時にエラーが発生しました。\n内容: ' + error.message);
	});

// イベント
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(
			event.name,
			async (...args) => await event.execute(...args, client)
		);
	}
};

// const loggingFiles = fs.readdirSync('./logging').filter((file) => file.endsWith('.js'));
// for (const file of loggingFiles) {
// 	const event = require(`./logging/${file}`);
// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args, client));
// 	} else {
// 		client.on(
// 			event.name,
// 			async (...args) => await event.execute(...args, client)
// 		);
// 	}
// };

// ボタン
const buttonCommands = fs.readdirSync('./interactions/buttons');
for (const module of buttonCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/buttons/${module}`)
		.filter((file) => file.endsWith('.js'));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/buttons/${module}/${commandFile}`);
		client.buttonCommands.set(command.id, command);
	}
};

// コンテキストメニュー
const contextMenus = fs.readdirSync('./interactions/context');

for (const folder of contextMenus) {
	const files = fs
		.readdirSync(`./interactions/context/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of files) {
		const menu = require(`./interactions/context/${folder}/${file}`);
		const keyName = `${folder.toUpperCase()} ${menu.data.name}`;
		client.contextCommands.set(keyName, menu);
	}
}

// スラッシュコマンド
const slashCommands = fs.readdirSync('./commands');
for (const module of slashCommands) {
	const commandFiles = fs
		.readdirSync(`./commands/${module}`)
		.filter((file) => file.endsWith('.js'));

	for (const commandFile of commandFiles) {
		const command = require(`./commands/${module}/${commandFile}`);
		client.slashCommands.set(command.data.name, command);
	}
};

client.player.on('trackStart', (queue, track) => {
	queue.setVolume(80);
	queue.metadata.channel.send(`▶ | **${track.title}** を <#${queue.connection.channel.id}> で再生中です。`);
});

client.player.on('trackAdd', (queue, track) => {
	queue.metadata.channel.send(`🎶 | **${track.title}** がキューに追加されました。`);
});

client.player.on('botDisconnect', queue => {
	queue.metadata.channel.send('❌ | 音声チャネルから手動で切断され、キューをクリアしました。');
});

client.player.on('channelEmpty', queue => {
	queue.metadata.channel.send('❌ | VCにメンバーがいないため切断しました。');
});

client.player.on('queueEnd', queue => {
	queue.metadata.channel.send('✅ | キューの再生が終了しました。');
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commandJsonData = [
	...Array.from(client.slashCommands.values()).map((command) => command.data.toJSON()),
	...Array.from(client.contextCommands.values()).map((c) => c.data),
];

(async () => {
	try {
		console.log('アプリケーションコマンドの再読み込みを開始しました。');

		await rest.put(
			// Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commandJsonData }
		);

		console.log('アプリケーションのコマンドの再読み込みに成功しました。');
	} catch (error) {
		console.error('[エラー] ボット起動時にエラーが発生しました。\n内容: ' + error.message);
	}
})();

// ログイン
client.login(process.env.TOKEN).catch(error => {
    console.error('[エラー] ボット起動時にエラーが発生しました。\n内容: ' + error.message);
});
