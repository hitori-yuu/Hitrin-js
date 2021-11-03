const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const weather = require('weather-js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Show the weather for that city.')
        .addStringOption(option => option.setName('city').setDescription('the location name or zipcode'))
        .addStringOption(option => option.setName('degreetype').setDescription('F or C')),
	async execute(interaction) {
        const city = interaction.options.getString('city')
        const degree = interaction.options.getString('degreetype')
        weather.find({search: city, degreeType: degree}, async function(err, result) {
        console.log(JSON.stringify(result, null, 1));
        const res = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('Weather Information')
            .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({format: 'png'}), interaction.user.displayAvatarURL({format: 'png'}))
            .addFields(
                { name: result.location.name, value: `**[Temperature]** ${result.current.temperature}℃\n**[feelslike]** ${result.current.feelslike}\n**[Sky]** ${result.current.skytext}` },
            )
            .setThumbnail(result.current.imageUrl)
            .setFooter('Hitorin')
            .setTimestamp()
        await interaction.reply({ embeds: [res] });
        });
	},
};

// Options:
// search:     location name or zipcode
// degreeType: F or C