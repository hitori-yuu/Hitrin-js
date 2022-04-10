const { MessageEmbed } = require('discord.js');
const guildsModel = require('../models/guildsSchema');

module.exports = {
	name: 'guildMemberAdd',
	async execute(client, interaction) {
		const guildsData = await guildsModel.findOne({ _id: interaction.guild.id });
		if (!guildsData) return;
		if (!guildsData.welcomeCh === 'none') {
				const welcome = new MessageEmbed()
					.setColor('#88cb7f')
					.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
					.setDescription(`<@${interaction.user.id}> さんがサーバーに参加しました！\n「__${interaction.guild.name}__」の **${interaction.guild.memberCount}番目** のメンバーです！`)
					.setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
					.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
					.setTimestamp();
				await client.channels.cache.get(guildsData.welcomeCh).send({ embeds: [welcome] });
		}
		else return;
	},
};