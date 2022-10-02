const { InteractionError } = require('../handlers/error');

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		try {
			const { client } = interaction;

			if (!interaction.isContextMenuCommand()) return;

			if (interaction.isUserContextMenuCommand()) {
				const command = client.contextCommands.get(
					"USER " + interaction.commandName
				);

				await interaction.deferReply();
				await command.execute(interaction);
				return;
			}
			else if (interaction.isMessageContextMenuCommand()) {
				const command = client.contextCommands.get(
					"MESSAGE " + interaction.commandName
				);

				await interaction.deferReply();
				await command.execute(interaction);
				return;
			}
		} catch (error) {
			return InteractionError(error, interaction);
		}
	},
};
