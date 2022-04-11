const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const commands = [];
const client_id = '876116418037444630';
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	console.log('ロード完了: ' + file)
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(client_id), { body: commands })
	.then(() => console.log('[起動] アプリケーションコマンド登録完了'))
	.catch(console.error);

// rest.put(Routes.applicationGuildCommands(client_id, '914150885473542175'), { body: commands })
// 	.then(() => console.log('[起動] ギルドコマンド登録完了'))
// 	.catch(console.error);