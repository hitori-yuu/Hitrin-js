const { textToSpeech } = require('../functions/textToSpeech');
// const usersModel = require('../models/usersSchema');
const config = require('../config.json');

module.exports = {
    name: 'messageCreate',

    async execute(message) {
        try {
            if (message.author.bot || !message.guild) return;
            const channel = message.member.voice.channel;
            if (!channel) return;

            if (message.channel.id === message.client.voiceChannels.get(channel.id)) {
                await textToSpeech(message.client, message.guild, message.author.id, channel, message.cleanContent.toLowerCase(), config.defaultSpeaker | 2, message);
            }
        } catch(error) {
            return console.error(error);
        }
    },
};