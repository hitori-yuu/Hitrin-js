const { default: axios } = require("axios");
const rpc = axios.create({
    baseURL: "http://127.0.0.1:50021",
    proxy: false,
    timeout: 2000,
});
const { getVoiceConnection, createAudioResource, StreamType, createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");
const fs = require('fs');
const usersModel = require('../models/usersSchema');

module.exports = {
    name: 'messageCreate',

    async execute(message) {
        if (message.author.bot || !message.guild) return;
        if (message.content.match(/http:|https:/)) return;
        const channel = message.member.voice.channel;
        if (!channel) return;
        var voice;

        if (message.channel.id === message.client.voiceChannels.get(channel.id)) {
            const filepath = "./sounds/" + message.author.id + ".wav"

            const usersData = await usersModel.find();
            const data = usersData.filter(data => data.id  === message.author.id);
            if (!data.length > 0 || !data) {
                voice = 5;
            } else {
                voice = data[0].speaker
            }

            try {
                await generateAudio(message, filepath, voice);
                await play(message, filepath);
            } catch(error) {
                console.error('[エラー] 読み上げ時にエラーが発生しました。\n内容: ' + error.message);
            }
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
