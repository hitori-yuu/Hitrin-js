const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../functions/embeds');
const { InteractionType } = require('discord-api-types/v10');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
		const { client } = interaction;

		if (interaction.type !== InteractionType.ModalSubmit) return;

		const command = client.modalCommands.get(interaction.customId);

		if (!command) return;

		try {
            await interaction.deferReply();
			await command.execute(interaction);
			return;
		} catch (error) {
			console.error(error);
            await interaction.followUp({
                embeds: [ErrorEmbed(error)]
            });
			return;
		};
	},
};