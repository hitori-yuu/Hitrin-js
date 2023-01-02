const config = require('../config.json');

module.exports = {
	async execute(message) {
		return message.channel.send(
			`現在のプレフィックス: \`${config.prefix}\``
		);
	},
};