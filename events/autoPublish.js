const { ChannelType } = require('discord.js');
const guildsModel = require('../models/guildsSchema.js');

module.exports = {
    name: 'messageCreate',

    async execute(message) {
        try {
            if (message.author.bot || !message.guild) return;

            if (message.channel.type === ChannelType.GuildNews) {
                const guildsData = await guildsModel.find();
                const data = guildsData.filter(data => data.id  === message.guild.id);
                if (data.length <= 0) return;
                if (data[0].settings.autoPublish) {
                    if (message.crosspostable) {
                        message.crosspost()
                            .then((message) => message.react('📢'))
                            .catch(console.error);
                    } else return;
                }
            }
        } catch(error) {
            console.error('[エラー] 自動公開時にエラーが発生しました。\n内容: ' + error.message)
        }
    },
};
