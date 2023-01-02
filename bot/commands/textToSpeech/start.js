const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../functions/embeds');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	name: 'start',
	description: '読み上げを開始します。',
    category: 'tts',

	execute(message, args) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.channel.send({
                embeds: [CustomErrorEmbed('あなたが先にVCに入っている必要があります。')]
            });

        joinVoiceChannel({
            guildId: message.guild.id,
            channelId: voiceChannel.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: true,
        });

        message.client.voiceChannels.set(voiceChannel.id, message.channel.id);
        message.channel.send({
            embeds: [SuccessEmbed(`読み上げを開始 ${message.channel} → ${voiceChannel}`, 'VOICEVOX:四国めたん')]
        });
	},
};