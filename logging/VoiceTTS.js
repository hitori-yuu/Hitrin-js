const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
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
	name: 'voiceStateUpdate',

	async execute(oldMember, newMember) {
        try {
            const queue = oldMember.client.player.getQueue(oldMember.guild.id);
            if (queue) return;

            var executor = oldMember;
            if (!oldMember.sessionId) executor = newMember;
            const member = executor.guild.members.cache.get(executor.id);

            const memberName = member.nickname || member.user.username;

            var text = `${memberName}が退出しました。`
            if (!oldMember.channelId) text = `${memberName}が接続しました。`;

            const filepath = "./sounds/" + oldMember.guild.id + ".wav"

            const usersData = await usersModel.find();
            const data = usersData.filter(data => data.id  === member.user.id);
            if (!data.length > 0 || !data) {
                voice = 5;
            } else {
                voice = data[0].speaker
            }
            await generateAudio(text, filepath, voice);
            await play(oldMember.guild.id, filepath);
        } catch(error) {
            console.error('[エラー] 読み上げ時にエラーが発生しました。\n内容: ' + error.message);
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
