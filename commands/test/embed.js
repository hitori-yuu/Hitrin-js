const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("embed")
		.setDescription("テストCMD"),

	async execute(interaction) {
		const Embed = new EmbedBuilder()
		.setColor('#e2041b')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL(), url: interaction.user.displayAvatarURL() })
		.setDescription('テスト')
		.setThumbnail(interaction.client.user.displayAvatarURL())
		.setTimestamp()
		.setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
		interaction.followUp({
			embeds: [Embed]
		});
	},
};
