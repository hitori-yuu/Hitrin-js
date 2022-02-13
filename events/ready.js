module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		setInterval(() => {
			client.user.setActivity(`/help | 1.0.5v | ${client.guilds.cache.size} サーバー | ${client.users.cache.size} ユーザー`, { type: 'PLAYING' }, { status: 'online' });
		}, 10000);
	},
};

// client.user.setActivity(`/help | ${client.guilds.cache.size} servers | ${client.users.cache.size} users`, { type: 'PLAYING' }, { status: 'online' });
// client.user.setActivity(`/help | 1.0.1v | ${client.guilds.cache.size} servers | ${client.users.cache.size} users`, { type: 'PLAYING' }, { status: 'idle' });