const { SlashCommandBuilder } = require('@discordjs/builders');
const translate = require('@imlinhanchao/google-translate-api');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('Replies with Pong!')
		.addStringOption(option => option.setName('text').setDescription('the text'))
		.addStringOption(option => option.setName('language').setDescription('the language').addChoice('Japanese', 'ja').addChoice('English', 'en')),
	async execute(interaction) {
		const original = interaction.options.getString('text');
		const lang = interaction.options.getString('language');
		translate(original, { to: lang }).then(res => {
			interaction.reply(res.text);
		}).catch(err => {
			console.error(err);
		});
	},
};