const fs = require('fs');
const { Client, Collection } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();
const profileModel = require('./models/profileSchema');
const guildsModel = require('./models/guildsSchema');


const options = {
	intents: ['GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES'],
};
const client = new Client(options);

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
		console.log('Connected to the database.');
	})
	.catch((error) => {
		console.log(error);
	});

client.on('interactionCreate', async interaction => {
	const profileData = await profileModel.findOne({ _id: interaction.user.id });
	const guildsData = await guildsModel.findOne({ _id: interaction.guild.id });
	if (!profileData) {
		const profile = await profileModel.create({
			_id: interaction.user.id,
			coins: 2500,
		});
		profile.save();
	}
	if (!guildsData) {
		const guild = await guildsModel.create({
			_id: interaction.guild.id,
			ownerID: interaction.guild.ownerId,
			globalBan: true,
			welcomeCh: null,
		});
		guild.save();
	}

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
		const profile = await profileModel.findOneAndUpdate(
			{
				userID: interaction.user.id,
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
		console.error(error);
		await interaction.reply({ content: 'コマンド実行時にエラーが発生しました。', ephemeral: true });
	}
});

client.login(process.env.TOKEN);