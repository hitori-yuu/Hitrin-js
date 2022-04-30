const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('simjoin')
		.setDescription('test'),
	async execute(interaction, client) {
		client.emit('guildMemberAdd', interaction.member);
		interaction.reply('設定している場合、指定のチャンネルに歓迎メッセージを送信しました。');
	},
};