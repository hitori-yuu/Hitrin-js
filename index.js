const fs = require('fs');
const { Client, Collection, MessageEmbed } = require('discord.js');
const { codeBlock } = require('@discordjs/builders');
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
			welcomeCh: null,
			globalBan: true,
			autoMod: true,
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
		error_unknown(interaction, error);
	}
});

function error_unknown(interaction, error) {
	const err = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
		.setDescription('無知のエラーが発生しました。既に開発者に報告されています。')
		.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
		.setTimestamp();
	const error_log = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('エラー')
		.setDescription('【エラー内容】\n' + codeBlock('js', error))
		.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
		.setTimestamp();
	const log = client.channels.cache.get('919599721184628807').send({ embeds: [error_log] });
	return interaction.reply({ embeds: [err] }), log;
}

client.login(process.env.TOKEN);