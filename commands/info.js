const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
let bot = 'BOT';
require('dotenv').config();
const version = process.env.VERSION;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Show its details.')
		.addStringOption(option => option.setName('type').setDescription('the type').addChoice('BOT', 'bot').addChoice('USER', 'user').addChoice('MEMBER', 'member').addChoice('SERVER', 'server'))
		.addUserOption(option => option.setName('target').setDescription('the user/member')),

	async execute(interaction, client) {
		const type = interaction.options.getString('type');
		if (type === 'user') {
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
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [u] });
		}

		if (type === 'member') {
			const member = interaction.options.getMember('target');
			if (!member.user.bot) bot = 'USER';
			const m = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('Member Details')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**General:**__', value: `**[Name]** ${member.user.tag}\n**[ID]** ${member.id}\n**[Nickname]** ${member.nickname || 'None'}\n**[Type]** ${bot}` },
					{ name: '__**Temporal:**__', value: `**[Created At]** ${new Date(member.user.createdTimestamp).toLocaleDateString()}\n**[Joined At]** ${new Date(member.joinedTimestamp).toLocaleDateString()}` },
				)
				.setThumbnail(member.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [m] });
		}

		if (type === 'server') {
			const server = interaction.guild;
			const members = interaction.guild.members.cache;
			let tier = '0';
			if (!server.premiumTier == 'NONE') tier = server.premiumTier;
			const s = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('Server Details')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**General:**__', value: `**[Name]** ${server.name}\n**[ID]** ${server.id}\n**[Owner]** <@${server.ownerId}>` },
					{ name: '__**Temporal:**__', value: `**[Created At]** ${new Date(server.createdTimestamp).toLocaleDateString()}\n**[BOT Joined At]** ${new Date(server.joinedTimestamp).toLocaleDateString()}` },
					{ name: '__**Amount:**__', value: `**[Members]** ${server.memberCount}(👤:${members.filter(member => !member.user.bot).size}, 🤖:${members.filter(member => member.user.bot).size})\n**[Text Channels]** ${server.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').size}\n**[Voice Channels]** ${server.channels.cache.filter(ch => ch.type === 'GUILD_VOICE').size}\n**[Emojis]** ${server.emojis.cache.size}\n**[Boosts]** ${tier} lv(${server.premiumSubscriptionCount || '0'} boosts)` },
				)
				.setThumbnail(server.iconURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			interaction.reply({ embeds: [s] });
		}

		if (type === 'bot') {
			const author = client.users.cache.get('874184214130602015');
			const b = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('Bot Details')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**General:**__', value: `**[Name]** ${client.user.tag}\n**[ID]** ${client.user.id}\n**[Author]** <@${author.id}>` },
					{ name: '__**Temporal:**__', value: `**[Created At]** ${new Date(client.user.createdTimestamp).toLocaleDateString()}` },
					{ name: '__**Version:**__', value: `**[Bot]** ${version}\n**[Language]** discord.js@${require('discord.js').version}` },
					{ name: '__**Status:**__', value: `**[Ping]** ws:${client.ws.ping}ms\n**[Servers]** ${client.guilds.cache.size} servers\n**[Users]** ${client.users.cache.size} users` },
				)
				.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [b] });
		}
	},
};