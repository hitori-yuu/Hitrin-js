const { ComponentType, InteractionType } = require('discord.js');
const { InteractionError } = require('../handlers/error');

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		try {
			const { client } = interaction;
			const command = client.buttons.get(interaction.customId);

			if (!interaction.isButton()) return;
			if (!command) return;

			await interaction.deferReply();
			await command.execute(interaction);
		} catch (error) {
			return InteractionError(error, interaction);
		}
	},
};
