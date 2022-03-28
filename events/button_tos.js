const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require('discord.js');
const profileModel = require('../models/profileSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
        if (interaction.customId === 'tos_ok') {
			const profile = await profileModel.findOneAndUpdate(
				{
					_id: interaction.user.id,
				},
				{
					$set: {
                        tos: true,
					},
				},
			);
			profile.save();
			interaction.channel.send('利用規約に同意しました。', { ephemeral: true });
		}
		if (interaction.customId === 'tos_no') {
			const profile = await profileModel.findOneAndUpdate(
				{
					_id: interaction.user.id,
				},
				{
					$set: {
                        tos: false,
					},
				},
			);
			profile.save();
			interaction.channel.send('利用規約に同意しないと使用できません。', { ephemeral: true });
		}
	},
};