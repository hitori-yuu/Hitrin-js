const guildsModel = require('../models/guildsSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
		const guildsData = await guildsModel.findOne({ _id: interaction.guild.id });
		if (!guildsData) return;
		else if (guildsData.autoMod) {
			//AntiSpam
			const map = new Map();
			if (interaction.channel.type == 'GUILD_TEXT') {
				if (map.has(interaction.user.id)) {
					const data = map.get(interaction.user.id);
					const { last, timer } = data;
					const diff = interaction.createdTimestamp - last.createdTimestamp;
					let msgs = data.msgs
					if (diff > 2000 ) {
						clearTimeout(timer);
						data.msgs = 1;
						data.last = interaction;
						data.timer = setTimeout(() => {
							map.delete(interaction.user.id);
						}, 4000)
						map.set(interaction.user.id, data)
					} else {
						++msgs;
						if (parseInt(msgs) >= 5) {
							interaction.channel.send('スパム行為をやめてください。')
					} else {
						data.msgs = msgs;
						map.set(interaction.user.id, data)
					}
				}
			} else {
				let remove = setTimeout(() => {
					map.delete(interaction.user.id);
				}, 4000)
				map.set(interaction.user.id, {
					msgs: 1,
					last: interaction,
					timer: remove
				})
				}
			};
		}
		else return;
	},
};