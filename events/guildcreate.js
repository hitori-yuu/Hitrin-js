const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'guildCreate',
	async execute(guild, client) {
		const log = new MessageEmbed()
			.setColor('#98d98e')
			.setTitle('Joined Log')
			.addFields(
				{ name: '__**Server:**__', value: `**[Name]** ${guild.name}\n**[ID]** ${guild.id}\n**[Owner]** <@${guild.ownerId}>` },
			)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		const owner = client.users.cache.get(guild.ownerId);
		const author = client.users.cache.get('874184214130602015');
		const thanks = new MessageEmbed()
			.setColor('#ffdb4f')
			.setTitle('Thanks for letting me in!')
			.setAuthor(`${owner.tag}`, `${owner.displayAvatarURL({ format: 'png' })}`)
			.addFields(
				{ name: '__**Author:**__', value: `**[Name]** ${author.tag}\n**[ID]** ${author.id}\n**[Mention]** <@${author.id}>` },
				{ name: '__**Help:**__', value: 'If you need help, please contact [me](https://twitter.com/yuu_hitorin).' },
				{ name: '__**ヘルプ:**__', value: 'もし何かバグや質問等ありましたら[私に](https://twitter.com/yuu_hitorin)ご連絡ください。' },
				{ name: '__**SNS:**__', value: '**[Twitter]** [yuu_hitorin](https://twitter.com/yuu_hitorin)\n**[GamerTag]** hitori_yuu / yuu.hitorin(STEAM)' },
			)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		await client.channels.cache.get('879943806118678528').send({ embeds: [log] });
		await client.users.cache.get(guild.ownerId).send({ content: '**Try typing `/help` / `/help` と入力してみてください！**', embeds: [thanks] });
		console.log('Bot joined server -> ' + guild.name);
	},
};