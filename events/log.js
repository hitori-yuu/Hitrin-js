const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.channel.type == 'GUILD_TEXT') {
			const s = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('Command Log')
				.setAuthor('/' + `${client.commands.get(interaction.commandName).data.name}`)
				.addFields(
					{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
					{ name: '__**Server:**__', value: `**[Name]** ${interaction.guild.name}\n**[ID]** ${interaction.guild.id}\n**[Owner]** <@${interaction.guild.ownerId}>` },
					{ name: '__**Channel:**__', value: `**[Name]** ${interaction.channel.name}\n**[ID]** ${interaction.channel.id}` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await client.channels.cache.get('879943806118678528').send({ embeds: [s] });
			console.log();
		}
		if (interaction.channel.type == 'DM') {
			const d = new MessageEmbed()
				.setColor('#89c3eb')
				.setTitle('Command Log(DM)')
				.setAuthor(`${interaction.content}`)
				.addFields(
					{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
				)
				.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
				.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
				.setTimestamp();
			await client.channels.cache.get('879943806118678528').send({ embeds: [d] });
		}
	},
};