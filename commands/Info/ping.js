const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Returns websocket latency.",

    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setColor("#89c3eb")
            .setDescription(`Pong: ${client.ws.ping}ms`)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
        interaction.followUp({ embeds: [embed] });
    },
};