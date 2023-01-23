const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const translate = require('@iamtraction/google-translate');
const config = require('../../../config.json');

module.exports = {
	data: {
		name: '英語に翻訳',
		type: 3,
	},

	async execute(interaction) {
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        translate(message.cleanContent, { to: 'en' }).then(res => {
            return interaction.followUp({
                content: res.text
            });
        }).catch((error) => {
            return console.error(error);
        });
	},
};