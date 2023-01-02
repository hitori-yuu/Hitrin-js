const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { loadCommands } = require('../../../handlers/commands');
const { loadEvents } = require('../../../handlers/events');

module.exports = {
    category: 'tts',

    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start Text-To-Speech.')
        .setDescriptionLocalizations({
            'en-US': 'Start Text-To-Speech.',
            'ja': '読み上げを開始します。',
        })
        .setDMPermission(false),

	async execute(interaction, args) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) return interaction.reply({
                embeds: [CustomErrorEmbed('あなたが先にVCに入っている必要があります。')]
            });

        joinVoiceChannel({
            guildId: interaction.guild.id,
            channelId: voiceChannel.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: true,
        });

        await interaction.client.voiceChannels.set(voiceChannel.id, interaction.channel.id);
        await interaction.reply({
            embeds: [SuccessEmbed(`読み上げを開始 ${interaction.channel} → ${voiceChannel}`, 'VOICEVOX:四国めたん')]
        });
	},
};