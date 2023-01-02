const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../functions/embeds');
const { InteractionType, ComponentType } = require('discord-api-types/v10');

module.exports = {
	name: 'interactionCreate',

	execute: async (interaction) => {
		const { client } = interaction;

		if (!interaction.isContextMenuCommand()) return;

		if (interaction.isUserContextMenuCommand()) {
			const command = client.contextMenus.get('USER ' + interaction.commandName);

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
			}
		}
		else if (interaction.isMessageContextMenuCommand()) {
			const command = client.contextMenus.get('MESSAGE ' + interaction.commandName);

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
			}
		}
		else {
			console.error(error);
		};
	},
};