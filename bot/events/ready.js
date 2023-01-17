const config = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,

	async execute(client) {
		try {
			switch (config.mode) {
				case 'NORMAL':
					console.log(`ログイン完了: ${client.user.tag}`);
					break;
				case 'DEBUG':
					console.log(`ログイン完了: ${client.user.tag}`);
					console.log('=== デバッグモードで動作します ===');
			}
			setInterval(() => {
				if (config.mode == 'NORMAL') {
					client.user.setPresence({ activities: [{ name: `v${config.version} | ${client.guilds.cache.size} Servers` }], status: 'online' });
				} else {
					client.user.setPresence({ activities: [{ name: `v${config.version} | 現在調整中...` }], status: 'idle' });
				};
			}, 30000)
		} catch (error) {
			return console.error(error);
		}
	},
};
