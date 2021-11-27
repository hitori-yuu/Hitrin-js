const fs = require('fs');
const { Client, Collection } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const options = {
	intents: ['GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES'],
};
const client = new Client(options);

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
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
		console.log('Connected to the database.');
	})
	.catch((error) => {
		console.log(error);
	});

client.on('interactionCreate', async interaction => {
	const profileModel = require('./models/coins.js');
	const profileData = await profileModel.findOne({ userID: interaction.user.id });
	if (!profileData) {
		const profile = await profileModel.create({
			userID: interaction.user.id,
			coins: 2000,
		});
		profile.save();
	}

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.TOKEN);