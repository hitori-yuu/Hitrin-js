const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
	data: {
		name: 'Avatar',
		type: 2,
	},

	async execute(interaction) {
        const member = interaction.guild.members.cache.get(interaction.targetId);
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('1024')
                    .setLabel('1024')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('2048')
                    .setLabel('2048')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('4096')
                    .setLabel('4096')
                    .setStyle(ButtonStyle.Primary),
            );

        const avatarEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${member.displayName} のアバター`)
            .setImage(member.user.displayAvatarURL({ extension: 'png', size: 2048 }))
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        return await interaction.followUp({
            embeds: [avatarEmbed],
            components: [row]
        });
	},
};