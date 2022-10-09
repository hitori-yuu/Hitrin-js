const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getVoiceConnection, createAudioResource, StreamType, createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");
const { isCreatedGuild } = require('../functions/isAvailable');
const { guildsData } = require('../functions/MongoDB');
const { hasPermissions } = require('../functions/hasPermissions');
const { Error } = require('../handlers/Error');
const { default: axios } = require("axios");
const rpc = axios.create({
    baseURL: "http://127.0.0.1:50021",
    proxy: false,
    timeout: 5000,
});
const fs = require('fs');


module.exports = {
	name: 'voiceStateUpdate',

	async execute(oldState, newState) {
        try {
            const guild = await guildsData(oldState.guild);
            var channel = oldState.guild.channels.cache.get(oldState.client.voiceChannels.get(oldState.channelId || newState.channelId));
            const member = oldState.guild.members.cache.get(oldState.id);
            const oldCh = oldState.guild.channels.cache.get(oldState.channelId);
            const newCh = oldState.guild.channels.cache.get(newState.channelId);
            const filepath = "./sounds/" + oldState.guild.id + ".wav"
            var text;

            if (!hasPermissions(oldState.guild.members.cache.get(oldState.client.user.id), PermissionFlagsBits.ViewAuditLog)) return;
            if (!await isCreatedGuild(oldState.guild)) return;
            if (!guild.settings.TTS.vcLog || guild.settings.TTS.vcLog == undefined) return;

            if (oldState.channelId === newState.channelId) return;
            if (!oldState.channelId && newState.channelId) {
                channel.send({ content: `**${member.displayName}** が ${newCh} に参加しました。` });
                text = `${member.displayName}が参加しました。`;
            };
            if (oldState.channelID && !newState.channelID) {
                if (!oldState.client.voiceChannels.get(oldState.channelId)) return;
                channel.send({ content: `**${member.displayName}** が ${oldCh} から切断しました。` });
                text = `${member.displayName}が切断しました。`;
            };

            await generateAudio(text, filepath, 5);
            await play(oldState.guild.id, filepath);
        } catch (error) {
            return Error(error);
        }
	},
};

async function generateAudio(text, filepath, voice) {
    const audio_query = await rpc.post(`audio_query?text=${encodeURI(text)}&speaker=${voice}`)
    const synthesis = await rpc.post("synthesis?speaker=" + voice, JSON.stringify(audio_query.data), {
        responseType: 'arraybuffer',
        headers: {
            "accept": "audio/wav",
            "Content-Type": "application/json"
        }
    });

    fs.writeFileSync(filepath, new Buffer.from(synthesis.data), 'binary');
}

async function play(guild, filepath) {
    const connection = await getVoiceConnection(guild);

    if (!connection) return;
    const resource = createAudioResource(filepath, { inputType: StreamType.Arbitrary });
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    player.play(resource);
    connection.subscribe(player);
}