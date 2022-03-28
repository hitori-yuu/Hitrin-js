const guildsModel = require('../models/guildsSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
		const guildsData = await guildsModel.findOne({ _id: interaction.guild.id });
		if (!guildsData) return;
		if (guildsData.autoPublish == true) {
            if (interaction.channel.type === 'GUILD_NEWS') {
                interaction.crosspost()
                .then(() => interaction.react('<:app:941652983966478417>'))
                .catch(console.error);
            } else return;
		}
		else return;
	},
};