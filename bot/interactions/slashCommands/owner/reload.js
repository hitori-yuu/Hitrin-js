const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('コマンド・イベントを再読み込みします。'),

	execute(interaction) {
		try {
			const { loadCommands } = require('../../../handlers/commands');
			loadCommands(interaction.client);
			interaction.reply({
                embeds: [SuccessEmbed('コマンド・イベントの再読み込みに成功しました。')]
			});
		} catch (error) {
			console.error(error);
            interaction.reply({
                embeds: [ErrorEmbed(error)]
            });
		}
	},
};