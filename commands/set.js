const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('BOTに関することを設定します。')
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('ニックネーム', 'nick').addChoice('お知らせ', 'announce'))
		.addUserOption(option => option.setName('ニックネーム').setDescription('任意の文字列を入力')),
	async execute(interaction, client) {
		const type = interaction.options.getString('種類');
		let nick = interaction.options.getString('ニックネーム');
		if (nick == 'none' || null) nick = 'ヒトリン';

		const permission = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('あなたは実行に必要な権限を持っていません。実行に必要な権限： `CHANGE_NICKNAME`')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		const announce = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('Added follower')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.addFields(
				{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
				{ name: '__**Server:**__', value: `**[Name]** ${interaction.guild.name}\n**[ID]** ${interaction.guild.id}\n**[Owner]** <@${interaction.guild.ownerId}>` },
				{ name: '__**Channel:**__', value: `**[Name]** ${interaction.channel.name}\n**[ID]** ${interaction.channel.id}` },
			)
			.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();

		if (type === 'nick') {
			if (!interaction.member.permissions.has('CHANGE_NICKNAME')) return await interaction.reply({ embeds: [permission] });
			await interaction.guild.me.setNickname(nick);
			await interaction.reply('ニックネームを設定しました。 -> **' + nick + '**');
		}
		else if (type === 'announce') {
			const log = await client.channels.cache.get('879943806118678528').send({ embeds: [announce] });
			const success = await interaction.reply('このチャンネルでお知らせを受け取ります。');

			if (interaction.channel.type == 'GUILD_STORE') {return interaction.reply('このチャンネルは設定できません。');}
			else {
				const channel = client.channels.cache.get('913821026377420910');
				channel.addFollower(interaction.channel.id)
					.then(() => log, success)
					.catch(console.error);
			}
		}
	},
};