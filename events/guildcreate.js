const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'guildCreate',
	async execute(client, guild) {
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
			.setTitle('導入ありがとうございます！')
			.setAuthor(`${owner.tag}`, `${owner.displayAvatarURL({ format: 'png' })}`)
			.addFields(
				{ name: '__**作成者:**__', value: `**[名前]** ${author.tag}\n**[ID]** ${author.id}\n**[メンション]** <@${author.id}>` },
				{ name: '__**ヘルプ:**__', value: 'もし何かバグや質問等ありましたら[私に](https://twitter.com/yuu_hitorin)ご連絡ください。' },
				{ name: '__**SNS:**__', value: '**[Twitter]** [yuu_hitorin](https://twitter.com/yuu_hitorin)\n**[Discord]** [サーバー](https://discord.gg/7BDq9ZNfkf)\n**[ゲーマータグ]** hitori_yuu / yuu.hitorin(STEAM)' },
				{ name: '__**お知らせ受け取り:**__', value: '**ボットのお知らせを受け取るために、任意のチャンネルで `/set type:announce`を実行してください。これを行わないとお知らせが来ません。**' },
			)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		await client.channels.cache.get('879943806118678528').send({ embeds: [log] });
		await client.users.cache.get(guild.ownerId).send({ embeds: [thanks], content: '**Try typing `/help` / `/help` と入力してみてください！**' });
		console.log('Bot joined server -> ' + guild.name);
	},
};