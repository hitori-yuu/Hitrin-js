const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
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

client.events = new Collection();
client.contextCommands = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.voiceChannels = new Collection();
client.voiceGuilds = new Collection();
client.errors = new Collection();

const { loadHandlers } = require('./handlers/loadHandlers');
loadHandlers(client);

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commandJsonData = [
	...Array.from(client.slashCommands.values()).map((command) => command.data.toJSON()),
	...Array.from(client.contextCommands.values()).map((command) => command.data),
];

(async () => {
	try {
		console.log('アプリケーションコマンドの再読み込みを開始しました。');

		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            // Routes.applicationCommands(process.env.CLIENT_ID),
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
