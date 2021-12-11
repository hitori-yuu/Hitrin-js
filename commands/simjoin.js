const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('simjoin')
		.setDescription('test'),
	async execute(interaction, client) {
		client.emit('guildMemberAdd', interaction.member);
		interaction.reply('test');
	},
};