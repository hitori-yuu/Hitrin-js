const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client } = require('discord.js');
let bot = 'BOT';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Show its details.')

		.addSubcommand(subcommand =>
			subcommand
				.setName('bot')
				.setDescription('Show bot details'))

		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Show the user details')
				.addUserOption(option => option.setName('target').setDescription('The user')))

		.addSubcommand(subcommand =>
			subcommand
				.setName('member')
				.setDescription('Show the member details')
				.addUserOption(option => option.setName('target').setDescription('The member')))

		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('Show the server details')),

	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');
			if (!user.bot) bot = 'USER';
			const u = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('User Details')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**General:**__', value: `**[Name]** ${user.tag}\n**[ID]** ${user.id}\n**[Type]** ${bot}` },
					{ name: '__**Temporal:**__', value: `**[Created At]** ${new Date(user.createdTimestamp).toLocaleDateString()}` },
				)
				.setThumbnail(user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin')
				.setTimestamp();
			await interaction.reply({ embeds: [u] });
		}

		if (interaction.options.getSubcommand() === 'member') {
			const member = interaction.options.getMember('target');
			if (!member.user.bot) bot = 'USER';
			const m = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('User Details')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**General:**__', value: `**[Name]** ${member.user.tag}\n**[ID]** ${member.id}\n**[Nickname]** ${member.nickname || 'None'}\n**[Type]** ${bot}` },
					{ name: '__**Temporal:**__', value: `**[Created At]** ${new Date(member.user.createdTimestamp).toLocaleDateString()}\n**[Joined At]** ${new Date(member.joinedTimestamp).toLocaleDateString()}` },
				)
				.setThumbnail(member.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin')
				.setTimestamp();
			await interaction.reply({ embeds: [m] });
		}

		if (interaction.options.getSubcommand() === 'server') {
			const server = interaction.guild;
			const s = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('User Details')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**General:**__', value: `**[Name]** ${server.name}\n**[ID]** ${server.id}\n**[Owner]** <@${server.ownerId}>` },
					{ name: '__**Temporal:**__', value: `**[Created At]** ${new Date(server.createdTimestamp).toLocaleDateString()}\n**[XXXX]** xxxx}` },
				)
				.setThumbnail(server.iconURL({ format: 'png' }))
				.setFooter('Hitorin')
				.setTimestamp();
			interaction.reply({ embeds: [s] });
		}

		if (interaction.options.getSubcommand() === 'bot') {
			const options = {
				intents: ['GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES'],
			};
			const client = new Client(options);
			console.log(client);
			// const b = new MessageEmbed()
			// .setColor('#89c3eb')
			// .setTitle('Bot Details')
			// .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({format: 'png'}), interaction.user.displayAvatarURL({format: 'png'}))
			// .addFields(
			//     { name: '__**General:**__', value: `**[Name]** ${client.tag}\n**[ID]** ${client.id}` },
			//     { name: '__**Temporal:**__', value: `**[Created At]** ${new Date(client.createdTimestamp).toLocaleDateString()}` },
			// )
			// .setThumbnail(client.displayAvatarURL({format: 'png'}))
			// .setFooter('Hitorin', client.displayAvatarURL({format: 'png'}))
			// .setTimestamp()
			// await interaction.reply({ embeds: [b] });
		}
	},
};

/*
const exampleEmbed = new MessageEmbed()
.setColor('#0099ff')
.setTitle('Some title')
.setURL('https://discord.js.org/')
.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
.setDescription('Some description here')
.setThumbnail('https://i.imgur.com/AfFp7pu.png')
.addFields(
    { name: 'Regular field title', value: 'Some value here' },
    { name: '\u200B', value: '\u200B' },
    { name: 'Inline field title', value: 'Some value here', inline: true },
    { name: 'Inline field title', value: 'Some value here', inline: true },
)
.addField('Inline field title', 'Some value here', true)
.setImage('https://i.imgur.com/AfFp7pu.png')
.setTimestamp()
.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
channel.send({ embeds: [exampleEmbed] });
*/