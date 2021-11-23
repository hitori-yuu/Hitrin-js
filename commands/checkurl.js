const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check-url')
		.setDescription('Use Norton Safeweb to check if the site is compromised or not.')
		.addStringOption(option => option.setName('url').setDescription('the url')),
	async execute(interaction) {
		const page = interaction.options.getString('url');
		fetch(`https://safeweb.norton.com/report/show?url=${encodeURI(page)}&ulang=jpn`).then(res => res.text()).then(norton => {
			if (norton.indexOf('安全性') != -1) {
				const embed_1 = new MessageEmbed()
					.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
					.setTitle('Safe.')
					.setThumbnail('https://onestopit.com.au/wp-content/uploads/2018/02/checked-circle.png')
					.setDescription(`Norton Safe Web has analyzed [The site](${page}) for safety and security issues.`)
					.setFooter('Powered by Norton Safeweb')
					.setTimestamp()
					.setColor('#7fff00');
				interaction.reply({ embeds: [embed_1] });
			}
			else if (norton.indexOf('［注意］') != -1) {
				const embed_2 = new MessageEmbed()
					.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
					.setTitle('Careful.')
					.setThumbnail('https://illust-stock.com/wp-content/uploads/bikkuri-mark-maru-aka.png')
					.setDescription(`Use caution when accessing [the site](${page}).`)
					.setFooter('Powered by Norton Safeweb')
					.setTimestamp()
					.setColor('#ff8c00');
				interaction.reply({ embeds: [embed_2] });
			}
			else if (norton.indexOf('警告') != -1) {
				const embed_3 = new MessageEmbed()
					.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
					.setTitle('Warning.')
					.setThumbnail('https://zet-art.net/wp-content/uploads/2019/03/caution-01.png')
					.setDescription(`[The site](${page}) is a known dangerous page. We recommend that you **do not view** this page.`)
					.setFooter('Powered by Norton Safeweb')
					.setTimestamp()
					.setColor('#8b0000');
				interaction.reply({ embeds: [embed_3] });
			}
			else {
				const embed_4 = new MessageEmbed()
					.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ format: 'png' }), interaction.user.displayAvatarURL({ format: 'png' }))
					.setTitle('Not confirmed.')
					.setThumbnail('https://illust-stock.com/wp-content/uploads/bikkuri-mark-maru-aka.png')
					.setDescription(`[The site](${page}) has not yet been rated.`)
					.setFooter('Powered by Norton Safeweb')
					.setTimestamp()
					.setColor('#ff1493');
				interaction.reply({ embeds: [embed_4] });
			}
		});
	},
};