const { codeBlock } = require('discord.js');

module.exports = {
	name: 'servers',
    description: 'ボットが参加しているサーバーを表示します。',
    category: 'owner',
    owner: true,

	execute(message, args) {
        message.channel.send({
            content:  `計${message.client.guilds.cache.size} のサーバーに参加しています。${codeBlock(message.client.guilds.cache.map(server => server.name).join(', '))}`
        });
	},
};