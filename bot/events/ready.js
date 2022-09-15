module.exports = {
	name: 'ready',

	async execute(client) {
		try {
			console.log(`ログイン完了: ${client.user.tag}`);
			client.user.setStatus('dnd');
			setInterval(() => {
				client.user.setActivity({
					  name: `2.0.0v-β | ${client.guilds.cache.size} Servers`,
				})
			}, 30000)
		} catch (error) {
            console.error('[エラー] ステータス設定時にエラーが発生しました。\n内容: ' + error.message);
		}
	},
};
