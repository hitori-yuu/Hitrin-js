const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inquiry')
		.setDescription('Replies with Pong!')
		.addStringOption(option => option.setName('type').setDescription('the type').addChoice('Request', 'req').addChoice('Question', 'q').addChoice('Bug', 'b').addChoice('Report', 'r'))
		.addStringOption(option => option.setName('body').setDescription('the body'))
		.addUserOption(option => option.setName('target').setDescription('the user')),
	async execute(interaction, client) {
		const type = interaction.options.getString('type');
		const body = interaction.options.getString('body') || 'None';
		if (!type === 'r') {
			let t = type;
			if (t === 'req') t = 'Request';
			if (t === 'q') t = 'Question';
			if (t === 'b') t = 'Bug';
			const success_1 = new MessageEmbed()
				.setColor('#028760')
				.setTitle('Send completely')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.setDescription(`**[Type]** ${t}\n**[Body]** ${body}`)
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			const in_1 = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle(`Inquiry [${t}]`)
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
					{ name: '__**Body:**__', value: `${body}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [success_1] });
			await client.channels.cache.get('912561215669149717').send({ embeds: [in_1] });
		}
		if (type === 'r') {
			const target = interaction.options.getUser('target');
			const success_2 = new MessageEmbed()
				.setColor('#028760')
				.setTitle('Send completely')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.setDescription(`**[Type]** Report\n**[Body]** ${body}\n**[Target]** <@${target.id}>`)
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			const in_2 = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('Inquiry [Report]')
				.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
				.addFields(
					{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
					{ name: '__**Target:**__', value: `**[Name]** ${target.tag}\n**[ID]** ${target.id}\n**[Mention]** <@${target.id}>` },
					{ name: '__**Body:**__', value: `${body}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await interaction.reply({ embeds: [success_2] });
			await client.channels.cache.get('912561215669149717').send({ embeds: [in_2] });
		}
	},
};