const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: {
		name: 'アバター取得',
		type: 2,
	},

	async execute(interaction) {
		const member = interaction.guild.members.cache.get(interaction.targetId);

		const avatarEmbed = new EmbedBuilder()
		.setColor('#59b9c6')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL(), url: interaction.user.displayAvatarURL() })
		.setTitle(`${member.user.username} のアバター`)
        .setImage(member.displayAvatarURL({format: 'png', size: 128}))
		.setTimestamp()
		.setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

		interaction.followUp({
			embeds: [avatarEmbed]
		});
	},
};