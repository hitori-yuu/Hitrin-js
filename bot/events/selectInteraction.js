const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../functions/embeds');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
		const { client } = interaction;

		if (!interaction.isStringSelectMenu()) return;

		const command = client.selectCommands.get(interaction.customId);

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