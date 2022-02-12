const { MessageEmbed } = require('discord.js');
const guildsModel = require('../models/guildsSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
		const guildsData = await guildsModel.findOne({ _id: interaction.guild.id });
		if (!guildsData) {
			const guild = await guildsModel.create({
				_id: interaction.guild.id,
				ownerID: interaction.guild.ownerId,
			});
			guild.save();
		}
		if (interaction.user.bot) return;
		if (!interaction.isCommand()) {return;}
		else if (interaction.channel.type == 'GUILD_TEXT') {
			const s = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('Command Log')
				.setAuthor({ name: '/' + `${client.commands.get(interaction.commandName).data.name}`, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
				.addFields(
					{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
					{ name: '__**Server:**__', value: `**[Name]** ${interaction.guild.name}\n**[ID]** ${interaction.guild.id}\n**[Owner]** <@${interaction.guild.ownerId}>` },
					{ name: '__**Channel:**__', value: `**[Name]** ${interaction.channel.name}\n**[ID]** ${interaction.channel.id}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			await client.channels.cache.get('879943806118678528').send({ embeds: [s] });
		}
		else if (interaction.channel.type == 'DM') {
			const d = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('Command Log(DM)')
				.setAuthor({ name: interaction.content })
				.addFields(
					{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
				.setTimestamp();
			await client.channels.cache.get('879943806118678528').send({ embeds: [d] });
		}
	},
};