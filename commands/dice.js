const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Roll the dice.')
		.addNumberOption(option => option.setName('times').setDescription('the times'))
		.addNumberOption(option => option.setName('side').setDescription('the side')),
	async execute(interaction) {
		const times = interaction.options.getNumber('times');
		const side = interaction.options.getNumber('side');
		if (times > 500 && side > 10 || side > 10000 || times > 200 && side > 1000) return await interaction.reply('The numbers are too large.');
		let total = 0;
		const list = [];
		for (let i = 0; i < times; i++) {
			const num = Math.floor(Math.random() * side) + 1;
			total += num;
			list.push(num);
		}
		await interaction.reply(`${times.toString()}d${side.toString()} >> **${total.toString()}** *\`(${list})\`*`);
	},
};