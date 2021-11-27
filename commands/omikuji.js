const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('omikuji')
		.setDescription('おみくじを引きます。'),
	async execute(interaction) {
		const arr = ['★☆大吉☆★', '..☆中吉☆..', '..◯小吉◯..', '...●吉●...', '..∇凶∇..', '...大凶...'];
		const random = Math.floor(Math.random() * arr.length);
		const result = arr[random];
		await interaction.reply(`今回の運勢は... ||__**${result}**__||`);
	},
};