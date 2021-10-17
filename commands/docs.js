const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('docs')
		.setDescription('Searching for in discord.js docs')
        .addStringOption(option => option.setName('target').setDescription('words to search')),
	async execute(interaction) {
        const args = interaction.options.getString('target')
        const uri = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args)}`
        axios
        .get(uri).then(async (embed) => {
          const { data } = embed
          if (data && !data.error) {
            await interaction.reply({ embeds: [data] });
          } else {
            await interaction.reply('Could not find that documentation')
          }
        })
	},
};