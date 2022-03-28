require('dotenv').config();
const version = process.env.VERSION;

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		setInterval(() => {
			client.user.setActivity(`/help | ${version}v | ${client.guilds.cache.size} サーバー | ${client.users.cache.size} ユーザー`, { type: 'PLAYING' }, { status: 'online' });
		}, 10000);
	},
};