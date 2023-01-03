const { codeBlock } = require('discord.js');

module.exports = {
	name: 'stop',
    description: 'ボットを終了させます。',
    category: 'owner',
    owner: true,

	execute(message, args) {
        message.channel.send({
            content:  'ボットを終了させました。'
        });
        message.client.destroy(true);
        console.log('stopコマンドによりボットが終了しました。');
	},
};