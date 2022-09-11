const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
	data: new SlashCommandBuilder()
        .setName('tts')
        .setNameLocalizations({
            'en-US': 'tts',
            'ja': '読み上げ',
        })
        .setDescription('Commands related to Text-to-Speech.')
        .setDescriptionLocalizations({
            'en-US': 'Commands related to Text-to-Speech.',
            'ja': 'キューを表示します。',
        })
		.setDMPermission(false)
        .addStringOption(
            option => option
            .setName('type')
            .setNameLocalizations({
                'en-US': 'type',
                'ja': '種類',
            })
            .setDescription('Select the type of execution.')
            .setDescriptionLocalizations({
                'en-US': 'Select the type of execution.',
                'ja': '実行する種類を選択。',
            })
			.addChoices(
				{ name: '開始', value: 'start' },
				{ name: '終了', value: 'end' },
			)
            .setRequired(true)
        ),

	async execute(interaction) {
        const type = interaction.options.getString('type');
        'user_dict_word?surface=hypixel&pronunciation=%E3%83%8F%E3%82%A4%E3%83%94%E3%82%AF%E3%82%BB%E3%83%AB&accent_type=2&word_type=PROPER_NOUN'
        const channel = interaction.member.voice.channel;

        if (!channel) return interaction.followUp({ content: 'あなたが先にVCに入っている必要があります。' });
        if (!channel.joinable) return interaction.followUp({ content: 'VCに参加する権限がありません。' });
        if (!channel.speakable) return interaction.followUp({ content: 'VCで音声を再生する権限がありません。' });

        if (type == 'start') {
            joinVoiceChannel({
                guildId: interaction.guild.id,
                channelId: channel.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfMute: false,
                selfDeaf: true,
            });
            interaction.client.voiceChannels.set(channel.id, interaction.channel.id);
            interaction.followUp({
                content: `<#${interaction.channel.id}> でのチャットを <#${channel.id}> で読み上げます。`
            });
        } else if (type == 'end') {
            const connection = getVoiceConnection(interaction.guild.id);
            connection.destroy(true);
            interaction.client.voiceChannels.delete(channel.id);
            interaction.followUp({
                content: '読み上げを終了しました。'
            });
        }
	},
};
