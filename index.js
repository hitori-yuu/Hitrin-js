const fs = require('fs');
const { Client, Collection, MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require('discord.js');
const { codeBlock } = require('@discordjs/builders');
const mongoose = require('mongoose');
require('dotenv').config();
const profileModel = require('./models/profileSchema');
const guildsModel = require('./models/guildsSchema');


const options = {
	intents: ['GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES'],
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
				.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			guild.save();
			console.log('(Guild)初期設定が完了しました -> ' + interaction.guild.name);
			client.channels.cache.get('879943806118678528').send({ embeds: [initial_guild] });
		}
		if (!profileData) {
			const tos = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('利用規約')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.setDescription('第一項：なんちゃらなんちゃら......')
				.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
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
				.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			console.log('(Member)初期設定が完了しました -> ' + interaction.user.tag);
			client.channels.cache.get('879943806118678528').send({ embeds: [initial_profile] });
			return interaction.reply({ embeds: [tos], components: [new MessageActionRow().addComponents([tos_ok, tos_no])] });
		}
		if (profileData && !profileData.tos) {
			const tos = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('利用規約')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.setDescription('第一項：なんちゃらなんちゃら......')
				.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
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
		console.error(error);
		error_unknown(interaction, error);
	}
});

function error_unknown(interaction, error) {
	const err = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription('無知のエラーが発生しました。既に開発者に報告されています。')
		.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	const error_log = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('エラー')
		.setDescription('【エラー内容】\n' + codeBlock('js', error))
		.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	const log = client.channels.cache.get('919599721184628807').send({ embeds: [error_log] });
	return interaction.reply({ embeds: [err] }), log;
}

client.login(process.env.TOKEN);

/*

*/