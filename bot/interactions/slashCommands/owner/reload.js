const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { loadCommands } = require('../../../handlers/commands');
const { loadEvents } = require('../../../handlers/events');

module.exports = {
	category: 'owner',

	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reload commands and events.')
        .setDescriptionLocalizations({
            'en-US': 'Reload commands and events.',
            'ja': 'コマンド・イベントを再読み込みします。',
        }),

	async execute(interaction) {
		try {
			for (let i = 0; i < interaction.client.events; i++) {
				interaction.client.removeEventListener(key, value, true);
			};
			loadEvents(interaction.client);
			loadCommands(interaction.client);
			await interaction.reply({
                embeds: [SuccessEmbed('コマンド・イベントの再読み込みに成功しました。')]
			});
		} catch (error) {
			console.error(error);
            await interaction.reply({
                embeds: [ErrorEmbed(error)]
            });
		}
	},
};