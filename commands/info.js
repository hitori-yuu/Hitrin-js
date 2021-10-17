const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Show its details.')

        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Show bot details'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Show the user details')
                .addUserOption(option => option.setName('target').setDescription('The user')))

        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Show the server details')),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'user') {
            await interaction.reply('User details...')
        }
        if (interaction.options.getSubcommand() === 'server') {
            await interaction.reply('Server details...')
        }
        if (interaction.options.getSubcommand() === 'bot') {
            await interaction.reply('Bot details...')
        }
        if (!interaction.options.getSubcommand()) {
            await interaction.reply('You didn\'t enter anything...')
        }
    }
};

/*
const exampleEmbed = new MessageEmbed()
.setColor('#0099ff')
.setTitle('Some title')
.setURL('https://discord.js.org/')
.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
.setDescription('Some description here')
.setThumbnail('https://i.imgur.com/AfFp7pu.png')
.addFields(
    { name: 'Regular field title', value: 'Some value here' },
    { name: '\u200B', value: '\u200B' },
    { name: 'Inline field title', value: 'Some value here', inline: true },
    { name: 'Inline field title', value: 'Some value here', inline: true },
)
.addField('Inline field title', 'Some value here', true)
.setImage('https://i.imgur.com/AfFp7pu.png')
.setTimestamp()
.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
channel.send({ embeds: [exampleEmbed] });
*/
