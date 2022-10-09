const { SlashCommandBuilder } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('応答するか確認します。')
		.setDMPermission(true),

	async execute(interaction, client) {
		try {
			await interaction.followUp({
				content: `pong: \`${interaction.client.ws.ping} ms\``
			});
		} catch (error) {
			return InteractionError(error, interaction);
		}
	},
};
