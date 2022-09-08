const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("応答するか確認します。")
		.setDMPermission(true),

	async execute(interaction, client) {
        interaction.followUp({
            content: 'pong!'
        });
	},
};
