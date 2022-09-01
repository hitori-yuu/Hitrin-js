module.exports = {
	id: 'agree',

	async execute(interaction) {
		await interaction.reply({
			content: "賛成しました。",
		});
		return;
	},
};
