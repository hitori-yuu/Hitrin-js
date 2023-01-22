const fs = require('fs');
const { EmbedBuilder, ChannelType, PermissionsBitField, Collection } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../functions/embeds');

async function fetchMore(channel, limit) {
    if (!channel) {
        throw new Error(`Expected channel, got ${typeof channel}.`);
    }
    if (limit <= 100) {
        return channel.messages.fetch({ limit });
    }

    let collection = new Collection();
    let lastId = null;
    let options = {};
    let remaining = limit;

    while (remaining > 0) {
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;

        if (lastId) {
        options.before = lastId;
        }

        let messages = await channel.messages.fetch(options);

        if (!messages.last()) {
        break;
        }

        collection = collection.concat(messages);
        lastId = messages.last().id;
    }

    return collection;
};

module.exports = {
	name: 'messages',
	description: '指定したサーバー内で送信されたメッセージ数を取得します。',
	usage: '[サーバーID]',
    category: 'owner',
	ownerOnly: true,

	async execute(message, args) {
        const guild = message.client.guilds.cache.get(args[0]) || message.guild;

        var messageCount = {
            member: 0,
            user: 0,
            bot: 0
        };

        guild.channels.cache.forEach(async channel => {
            if (channel.type !== ChannelType.GuildText) return;
            if (!channel.viewable) return;
            const msg = await fetchMore(channel, 30000);
            messageCount.member += msg.size;
            messageCount.user += msg.filter(msg => !msg.author.bot).size;
            messageCount.bot += msg.filter(msg => msg.author.bot).size;
        });

        message.channel.send({
            content: `**${guild.name}** のメッセージ数\nMember: ${messageCount.member} messages\nUser: ${messageCount.user} messages\nBot: ${messageCount.bot} messages`
        });
        setTimeout(async () => {
            message.channel.send({
                content: `**${guild.name}** のメッセージ数\nMember: ${messageCount.member} messages\nUser: ${messageCount.user} messages\nBot: ${messageCount.bot} messages`
            });
        }, 15000);
	},
};