require('dotenv').config();
const version = process.env.VERSION;

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log('[起動] ログイン完了: ' + client.user.tag);
		setInterval(() => {
			// client.user.setActivity(`テスト中のため使用できません。`, { type: 'PLAYING' }, { status: 'idle' });
			client.user.setActivity(`/help | ${version}v | ${client.guilds.cache.size} サーバー | ${client.users.cache.size} ユーザー`, { type: 'PLAYING' }, { status: 'online' });
		}, 10000);
	},
};