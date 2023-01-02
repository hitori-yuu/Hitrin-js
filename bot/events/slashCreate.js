const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../functions/embeds');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
		const { client } = interaction;

		if (!interaction.isChatInputCommand()) return;

		const command = client.slashCommands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
            await interaction.reply({
                embeds: [ErrorEmbed(error)]
            });
			return;
		};
	},
};