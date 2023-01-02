module.exports = {
	name: 'ping',
    description: '応答速度を表示します。',
    category: 'misc',

	execute(message, args) {
		message.channel.send({ content: `Pong: \`${message.client.ws.ping}ms\`` });
	},
};