const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('docs')
		.setDescription('discord.jsのドキュメントから検索します。')
		.addStringOption(option => option.setName('検索ワード').setDescription('任意の文字列を入力')),
	async execute(interaction) {
		const args = interaction.options.getString('検索ワード');
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