const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Replies with Pong!')
		.addNumberOption(option => option.setName('quantity').setDescription('the quantity'))
		.addNumberOption(option => option.setName('surface').setDescription('the surfaces')),
	async execute(interaction) {
		const quantity = interaction.options.getNumber('quantity');
		const surface = interaction.options.getNumber('surface');
		let total = 0;
		const list = [];
		for (let i = 0; i < quantity; i++) {
			const num = Math.floor(Math.random() * surface) + 1;
			total += num;
			list.push(num);
		}
		await interaction.reply(`${quantity.toString()}d${surface.toString()} >> **${total.toString()}** *(${list})*`);
	},
};