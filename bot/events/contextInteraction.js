const { InteractionError } = require('../handlers/error');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType, EmbedBuilder } = require('discord.js');

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		try {
			const { client } = interaction;

			if (!interaction.isUserContextMenuCommand()) return;

			const command = client.contextCommands.get(interaction.commandName);
			await interaction.deferReply();
			await command.execute(interaction);
		} catch (error) {
			console.log(error);
			return InteractionError(interaction, error);
		}
	},
};
