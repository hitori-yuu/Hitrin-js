const { SlashCommandBuilder, SlashCommandUserOption } = require('@discordjs/builders');
const { MessageEmbed, Options } = require('discord.js');

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
                .setName('member')
                .setDescription('Show the member details'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Show the server details')),

    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'user') {
            const user = interaction.options.getUser('target');
            var bot = 'BOT'
            if (!user.bot) bot = 'USER'
            const embed = new MessageEmbed()
                .setColor('#89c3eb')
                .setTitle('User Details')
                .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({format: 'png'}), interaction.user.displayAvatarURL({format: 'png'}))
                .addFields(
                    { name: '__**General:**__', value: `**[Name]** ${user.tag}\n**[ID]** ${user.id}\n**[Type]** ${bot}` },
                    { name: '__**Temporal:**__', value: `**[Created At]** ${user.createdAt}` },
                )
                .setThumbnail(user.displayAvatarURL({format: 'png'}))
                .setTimestamp()
                .setFooter('Hitorin', 'https://hitori-yuu.github.io/Hitorin-web/');
            await interaction.reply({ embeds: [embed] });
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
