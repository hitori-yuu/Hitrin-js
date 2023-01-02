const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const config = require('../../../config.json');

module.exports = {
	id: '1024',

	async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('1024')
                    .setLabel('1024')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('2048')
                    .setLabel('2048')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('4096')
                    .setLabel('4096')
                    .setStyle(ButtonStyle.Primary),
            );

        const userId = interaction.message.embeds[0].data.image.url.split('/');
        const member = interaction.guild.members.cache.get(userId[4]);
        const avatarEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${member.displayName} のアバター`)
            .setImage(member.user.displayAvatarURL({ extension: 'png', size: 1024 }))
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        return await interaction.update({
            embeds: [avatarEmbed],
            components: [row]
        });
	},
};