const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const cooldown = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('login')
		.setDescription('ログイン報酬を受け取ります。'),
	async execute(interaction, client) {
		if (cooldown.has(interaction.user.id)) return await interaction.reply('このコマンドは24時間に一度のみ実行できます。');
		const login = new MessageEmbed()
			.setColor('#ffdb4f')
			.setTitle('ログイン報酬！')
			.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
			.setDescription('__あなたは以下のログイン報酬を受け取りました！__\n**🪙250** *coins*')
			.setFooter('Hitorin', client.user.displayAvatarURL({ format: 'png' }))
			.setTimestamp();
		await interaction.reply({ embeds: [login] });
		const profileModel = require('../models/coins.js');
		await profileModel.findOneAndUpdate(
			{
				userID: interaction.user.id,
			},
			{
				$inc: {
					coins: 250,
				},
			},
		);
		cooldown.add(interaction.user.id);
		setTimeout(() => {
			cooldown.delete(interaction.user.id);
		}, 86400000);
	},
};