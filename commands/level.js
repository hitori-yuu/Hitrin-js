const { SlashCommandBuilder } = require('@discordjs/builders');
const Levels = require('discord-xp');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('Show the level and xp'),
	async execute(interaction) {
		const user = await Levels.fetch(interaction.user.id, interaction.guild.id);
		await interaction.reply(`${user.level}lv`);
	},
};
// \nTo the next level -> ${Levels.xpFor(user.level + 1) - user.xp}