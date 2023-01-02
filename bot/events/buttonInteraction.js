const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../functions/embeds');
const { InteractionType, ComponentType } = require('discord-api-types/v10');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
		const { client } = interaction;

		if (interaction.type !== InteractionType.MessageComponent) return;
		if (interaction.componentType !== ComponentType.Button) return;

		const command = client.buttonCommands.get(interaction.customId);

		if (!command) return;

		try {
			await command.execute(interaction);
			return;
		} catch (error) {
			console.error(error);
			interaction.client.errors.set(interaction.id, interaction.user.username);
            await interaction.followUp({
                embeds: [ErrorEmbed(error)]
            });
			return;
		};
	},
};