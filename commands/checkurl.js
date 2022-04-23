const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check-url')
		.setDescription('Norton Safewebを使って、サイトが危険にさらされているかどうかを確認します。')
		.addStringOption(option => option.setName('url').setDescription('the url')),
	async execute(interaction) {
		const page = interaction.options.getString('url');
        const file = new MessageAttachment('D:/folder/Hitrin/bot/js/v1/materials/norton_logo.png');

		fetch(`https://safeweb.norton.com/report/show?url=${encodeURI(page)}&ulang=jpn`).then(res => res.text()).then(norton => {
			if (norton.indexOf('安全性') != -1) {
				const embed_1 = new MessageEmbed()
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.setTitle('安全')
					.setThumbnail('https://onestopit.com.au/wp-content/uploads/2018/02/checked-circle.png')
					.setDescription(`ノートンセーフウェブは、 [サイト](${page}) の安全性とセキュリティの問題を分析しました。`)
					.setFooter({ text: 'Powered by Norton Safeweb', iconURL: 'attachment://norton_logo.png' })
					.setTimestamp()
					.setColor('#7fff00');
				interaction.reply({embeds: [embed_1], files: [file]})
			}
			else if (norton.indexOf('［注意］') != -1) {
				const embed_2 = new MessageEmbed()
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.setTitle('注意が必要')
					.setThumbnail('https://illust-stock.com/wp-content/uploads/bikkuri-mark-maru-aka.png')
					.setDescription(`[サイト](${page}) へのアクセスにはご注意ください。`)
					.setFooter({ text: 'Powered by Norton Safeweb', iconURL: 'attachment://norton_logo.png' })
					.setTimestamp()
					.setColor('#ff8c00');
				interaction.reply({embeds: [embed_2], files: [file]})
			}
			else if (norton.indexOf('警告') != -1) {
				const embed_3 = new MessageEmbed()
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.setTitle('警告')
					.setThumbnail('https://zet-art.net/wp-content/uploads/2019/03/caution-01.png')
					.setDescription(`[サイト](${page}) は、既知の危険なページです。**閲覧しないこと**をお勧めします。`)
					.setFooter({ text: 'Powered by Norton Safeweb', iconURL: 'attachment://norton_logo.png' })
					.setTimestamp()
					.setColor('#8b0000');
				interaction.reply({embeds: [embed_3], files: [file]})
			}
			else {
				const embed_4 = new MessageEmbed()
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.setTitle('未評価')
					.setThumbnail('https://illust-stock.com/wp-content/uploads/bikkuri-mark-maru-aka.png')
					.setDescription(`[サイト](${page}) はまだ評価されていません。`)
					.setFooter({ text: 'Powered by Norton Safeweb', iconURL: 'attachment://norton_logo.png' })
					.setTimestamp()
					.setColor('#ff1493');
				interaction.reply({embeds: [embed_4], files: [file]})
			}
		});
	},
};