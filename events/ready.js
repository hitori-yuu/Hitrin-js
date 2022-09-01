module.exports = {
	name: 'ready',

	async execute(client) {
		console.log(`ログイン完了: ${client.user.tag}`);
		setInterval(() => {
			client.user.setActivity({
			  name: `2.0.0v-β | ${client.guilds.cache.size} Servers`
			})
		}, 30000)
	},
};