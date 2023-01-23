const { AudioPlayerStatus, getVoiceConnection, createAudioResource, StreamType, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = {
	name: 'voiceStateUpdate',

	async execute(oldState, newState) {
        try {
            const connection = getVoiceConnection(oldState.guild.id);
            if (!connection) return;

            const keys = oldState.client.voiceChannels.keys();
            var map = [];

            for (const key of keys) {
                map.push(key);
            };

            if (map.includes(oldState.channelId)) {
                if (oldState.channelId && newState.channelId == null) {
                    disconnect(oldState.client, oldState.guild, oldState.channel, oldState.channelId, connection);
                }
                else {
                    disconnect(oldState.client, oldState.guild, oldState.channel, oldState.channelId, connection);
                };
            };
        } catch (error) {
			return console.error(error);
        }
	},
};

function disconnect(client, guild, channel, channelId, connection) {
    if (channel.members.size <= 1) {
        setTimeout(() => {
            if (channel.members.size === 1) {
                connection.destroy(true);
                guild.channels.cache.get(client.voiceChannels.get(channelId)).send({
                    content: '💥｜メンバーがいなくなったため読み上げを終了しました。'
                });
                client.voiceChannels.delete(channelId);
            }
        }, 5000);
    };
};