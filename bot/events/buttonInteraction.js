const { ComponentType, InteractionType } = require('discord.js');
const { InteractionError } = require('../handlers/error');

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		try {
			const { client } = interaction;
			const command = client.buttons.get(interaction.customId);

			if (!command) return;
			if (!interaction.type == InteractionType.MessageComponent) return;
			if (!interaction.componentType == ComponentType.Button) return;

			await interaction.deferReply();
			await command.execute(interaction);
		} catch (error) {
			return InteractionError(error, interaction);
		}
	},
};
