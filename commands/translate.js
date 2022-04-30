const { SlashCommandBuilder } = require('@discordjs/builders');
const translate = require('@imlinhanchao/google-translate-api');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('任意のテキストを翻訳します。')
		.addStringOption(option => option.setName('テキスト').setDescription('任意の文字列を入力').setRequired(true))
		.addStringOption(option => option.setName('言語').setDescription('翻訳先の言語').addChoice('日本語', 'ja').addChoice('英語', 'en').setRequired(true)),
	async execute(interaction) {
		const original = interaction.options.getString('テキスト');
		const lang = interaction.options.getString('言語');
		translate(original, { to: lang }).then(res => {
			interaction.reply(res.text);
		}).catch(err => {
			console.error(err);
		});
	},
};