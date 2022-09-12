const { SlashCommandBuilder } = require('discord.js');
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
            'ja': '読み上げに関するコマンド。',
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
                { name: '単語追加', value: 'add-word' },
				{ name: '単語削除', value: 'remove-word' },
			)
            .setRequired(true)
        ),

	async execute(interaction) {
        const type = interaction.options.getString('type');
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
            if (!connection) return interaction.followUp({ content: 'VCに参加していません。' });
            connection.destroy(true);
            interaction.client.voiceChannels.delete(channel.id);
            interaction.followUp({
                content: '読み上げを終了しました。'
            });
        } else if (type === 'add-word') {
            interaction.followUp({
                content: 'コマンド `/add-word` を使用して単語を追加してください。'
            });
        } else if (type === 'remove-word') {
            interaction.followUp({
                content: 'コマンド `/remove-word` を使用して単語を削除してください。'
            });
        }
	},
};
