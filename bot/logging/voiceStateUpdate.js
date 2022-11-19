const { isCreatedGuild } = require('../functions/isAvailable');
const { guildsData } = require('../functions/MongoDB');
const { textToSpeech } = require('../functions/textToSpeech');
const { Error } = require('../handlers/Error');

module.exports = {
	name: 'voiceStateUpdate',

	async execute(oldState, newState) {
        try {
            const guild = await guildsData(oldState.guild);
            const channel = oldState.guild.channels.cache.get(oldState.client.voiceChannels.get(oldState.channelId || newState.channelId));
            const member = oldState.guild.members.cache.get(oldState.id);
            const oldCh = oldState.guild.channels.cache.get(oldState.channelId);
            const newCh = oldState.guild.channels.cache.get(newState.channelId);
            var text;

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

            await textToSpeech(oldState.client, oldState.guild, oldState.guild.id, channel, text, 5);
        } catch (error) {
            return Error(error);
        }
	},
};