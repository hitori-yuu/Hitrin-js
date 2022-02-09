// const guildsModel = require('../models/guildsSchema');

// module.exports = {
// 	name: 'interactionCreate',
// 	async execute(client, interaction) {
// 		if (interaction.user.bot) {return;}
// 		const guildsData = await guildsModel.findOne({ _id: interaction.guild.id });
// 		if (!guildsData) {
// 			const guild = await guildsModel.create({
// 				_id: interaction.guild.id,
// 				ownerID: interaction.guild.ownerId,
// 				welcomeCh: null,
// 				globalBan: true,
// 				autoMod: true,
// 			});
// 			guild.save();
// 		}
// 		if (interaction.channel.type == 'GUILD_TEXT') {
// 			const lastSendTime = {};
// 			if (guildsData.autoMod == true) {
// 				if (Date.now() - lastSendTime[interaction.channel.id][interaction.author.id] <= 1000) return; interaction.channel.send('スパム行為をしないでください。');
// 			}
// 			else {return;}
// 		}
// 	},
// };