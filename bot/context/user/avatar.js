const { EmbedBuilder } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: {
		name: 'アバター取得',
		type: 2,
	},

	async execute(interaction) {
		try {
			const member = interaction.guild.members.cache.get(interaction.targetId);

			const avatarEmbed = new EmbedBuilder()
				.setColor('#59b9c6')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
				.setTitle(`${member.user.username} のアバター`)
				.setImage(member.displayAvatarURL({extension: 'png'}))
				.setTimestamp()
				.setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

			await interaction.followUp({
				embeds: [avatarEmbed]
			});
		} catch (error) {
			return InteractionError(interaction, error);
		}
	},
};