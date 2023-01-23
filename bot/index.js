const fs = require('fs');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('./config.json');
require('dotenv').config();

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
client.setMaxListeners(20);

client.commands = new Collection();
client.events = new Collection();
client.analytics = new Collection();
client.logEvents = new Collection();
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextMenus = new Collection();
client.modalCommands = new Collection();
client.cooldowns = new Collection();
client.autocompleteInteractions = new Collection();

client.voiceChannels = new Collection(); // (voice, text)
client.audioQueue = [];
client.isPlaying = false;

client.errors = new Collection();

client.commandsMisc = new Collection();
client.commandsInfo = new Collection();
client.commandsTts = new Collection();
client.commandsOwner = new Collection();

client.slashCommandsMisc = new Collection();
client.slashCommandsInfo = new Collection();
client.slashCommandsTts = new Collection();
client.slashCommandsOwner = new Collection();

const { MongoDB } = require('./functions/MongoDB');
const { loadAutocompleteInteractions } = require('./handlers/autocomplete');
const { loadButtonCommands } = require('./handlers/buttons');
const { loadCommands } = require('./handlers/commands');
const { loadContextMenus } = require('./handlers/contextMenus');
const { loadEvents } = require('./handlers/events');
const { loadAnalytics } = require('./handlers/analytics');
const { loadLogEvents } = require('./handlers/logEvents');
const { loadModalCommands } = require('./handlers/modalCommands');
const { loadSelectCommands } = require('./handlers/selectMenus');
const { loadSlashCommands } = require('./handlers/slashCommands');
MongoDB();
loadAutocompleteInteractions(client);
loadButtonCommands(client);
loadCommands(client);
loadContextMenus(client);
loadEvents(client);
loadAnalytics(client);
loadLogEvents(client);
loadModalCommands(client);
loadSelectCommands(client);
loadSlashCommands(client);

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commandJsonData = [
	...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
	...Array.from(client.contextMenus.values()).map((c) => c.data),
];

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),

			// Routes.applicationCommands(process.env.CLIENT_ID),

			{ body: commandJsonData }
		);

		console.log('スラッシュコマンドの再読み込みに成功しました。');
	} catch (error) {
        return console.error(error);
	}
})();

client.login(process.env.TOKEN);