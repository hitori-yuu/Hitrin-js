const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Make the BOT speak any words you want.')
		.addStringOption(option => option.setName('args').setDescription('The words')),
	async execute(interaction) {
		const arg = interaction.options.getString('args') || '.';
		await interaction.reply(arg);
	},
};