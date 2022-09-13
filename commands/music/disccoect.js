const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
	data: new SlashCommandBuilder()
        .setName('disconnect')
        .setNameLocalizations({
            'en-US': 'disconnect',
            'ja': '切断',
        })
        .setDescription('Disconnect from the currently participating VC.')
        .setDescriptionLocalizations({
            'en-US': 'Disconnect from the currently participating VC.',
            'ja': '現在参加しているVCから切断します。',
        })
		.setDMPermission(false),

	async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const queue = interaction.client.player.getQueue(interaction.guild.id);
        const connection = getVoiceConnection(interaction.guild.id);

        if (!channel) return interaction.followUp({ content: 'VCに参加していません。' });
        if (!queue) return interaction.followUp({ content: 'VCに参加していません。' });
        if (!connection) return interaction.followUp({ content: 'VCに参加していません。' });

        if (queue) queue.destroy(true);
        else if (connection) connection.destroy(true);
        interaction.followUp({
            content: `<#${channel.id}> から切断しました。`
        });
	},
};
