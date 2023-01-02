const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { loadCommands } = require('../../../handlers/commands');
const { loadEvents } = require('../../../handlers/events');

module.exports = {
    category: 'tts',

    data: new SlashCommandBuilder()
        .setName('end')
        .setDescription('Finish Text-To-Speech.')
        .setDescriptionLocalizations({
            'en-US': 'Finish Text-To-Speech.',
            'ja': '読み上げを終了します。',
        })
        .setDMPermission(false),

	async execute(interaction, args) {
        const voiceChannel = interaction.member.voice.channel;
        const connection = getVoiceConnection(interaction.guild.id);

        if (!voiceChannel) return interaction.reply({
                embeds: [CustomErrorEmbed('あなたが先にVCに入っている必要があります。')]
            });
        if (!connection) return interaction.reply({
                embeds: [CustomErrorEmbed('接続していません。')]
            });

        await connection.destroy(true);
        await interaction.client.voiceChannels.delete(voiceChannel.id);
        await interaction.reply({
            embeds: [SuccessEmbed(`読み上げを終了しました。`)]
        });
	},
};