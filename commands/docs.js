const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('docs')
		.setDescription('discord.jsのドキュメントから検索します。')
		.addStringOption(option => option.setName('検索').setDescription('任意の文字列を入力').setRequired(true)),
	async execute(interaction) {
		const args = interaction.options.getString('検索');
		const uri = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args)}`;
		axios
			.get(uri).then(async (embed) => {
				const { data } = embed;
				if (data && !data.error) {
					await interaction.reply({ embeds: [data] });
				}
				else {
					await interaction.reply('そのドキュメントは見つかりませんでした。');
				}
			});
	},
};