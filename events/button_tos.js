const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require('discord.js');
const profileModel = require('../models/profileSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
        if (interaction.user.bot) return;
        if (!interaction.isButton()) return;

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
			interaction.reply('利用規約に同意しました。再度実行してください。', { ephemeral: true });
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
			interaction.reply('利用規約に同意しないと使用できません。', { ephemeral: true });
		}
	},
};