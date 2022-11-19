const { TTSError } = require('../handlers/error');
const { textToSpeech } = require('../functions/textToSpeech');
const usersModel = require('../models/usersSchema');

module.exports = {
    name: 'messageCreate',

    async execute(message) {
        try {
            if (message.author.bot || !message.guild) return;
            const channel = message.member.voice.channel;
            if (!channel) return;

            if (message.channel.id === message.client.voiceChannels.get(channel.id)) {
                var voice;
                const usersData = await usersModel.find();
                const data = usersData.filter(data => data.id  == message.author.id);
                if (!data.length > 0 || !data) {
                    voice = 5;
                } else {
                    voice = data[0].speaker
                }

                await textToSpeech(message.client, message.guild, message.author.id, channel, message.cleanContent, voice);
            }
        } catch(error) {
            return TTSError(error, message);
        }
    },
};