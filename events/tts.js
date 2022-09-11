const { default: axios } = require("axios");
const rpc = axios.create({ baseURL: "http://127.0.0.1:50021", proxy: false });
const { getVoiceConnection, createAudioResource, StreamType, createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");
const fs = require('fs');

module.exports = {
    name: 'messageCreate',

    async execute(message) {
        if (message.author.bot || !message.guild) return;
        if (message.content.match(/http:|https:/)) return;
        const channel = message.member.voice.channel;
        if (!channel) return;

        if (message.channel.id === message.client.voiceChannels.get(channel.id)) {
            const filepath = "./sounds/" + message.author.id + ".wav"

            await generateAudio(message, filepath, 5);
            await play(message, filepath);
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

async function play(interaction, filepath) {
    const connection = await getVoiceConnection(interaction.guild.id);

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
