const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('del')
		.setDescription('指定のコマンドをすべて削除。')
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('ギルドコマンド', 'guild').addChoice('アプリケーションコマンド', 'application').setRequired(true)),
	async execute(interaction, client) {
		if (!interaction.user.id === '874184214130602015') return;
		const type = interaction.options.getString('種類');
		if (type === 'guild') {
			interaction.guild.commands.fetch()
				.then(commands => {
					for (let i = 0; i < commands.size; i++) {
						commands.delete();
					}
					interaction.reply('このサーバのギルドコマンドをすべて削除しました。');
				})
				.catch(console.error);
		}
		if (type === 'application') {
			client.application.commands.fetch()
				.then(commands => {
					for (let i = 0; i < commands.size; i++) {
						commands.delete();
					}
					interaction.reply('アプリケーションコマンドをすべて削除しました。');
				})
				.catch(console.error);
		}
	},
};