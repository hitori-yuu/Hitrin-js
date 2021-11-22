module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		setInterval(() => {
			client.user.setActivity(`/help | ${client.guilds.cache.size}servers | ${client.users.cache.size}users`, { type: 'PLAYING' }, { status: 'online' });
		}, 10000);
	},
};