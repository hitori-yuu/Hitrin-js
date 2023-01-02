const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../functions/embeds');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	name: 'disconnect',
    aliases: ['end'],
	description: '読み上げを終了します。',
    category: 'tts',

	execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        const connection = getVoiceConnection(message.guild.id);

        if (!voiceChannel) return message.channel.send({
                embeds: [CustomErrorEmbed('あなたが先にVCに入っている必要があります。')]
            });
        if (!connection) return message.channel.send({
                embeds: [CustomErrorEmbed('接続していません。')]
            });

        connection.destroy(true);
        message.client.voiceChannels.delete(voiceChannel.id);
        message.channel.send({
            embeds: [SuccessEmbed(`読み上げを終了しました。`)]
        });
	},
};