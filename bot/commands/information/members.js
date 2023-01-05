// const { SlashCommandBuilder, EmbedBuilder, ChannelType, AttachmentBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
// const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../../functions/isAvailable');
// const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData, logsData } = require('../../functions/MongoDB');
// const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
// const config = require('../../config.json');

// // module.exports = {
// //     name: 'members',
// //     description: 'サーバーのメンバー内訳を表示します。',
// //     category: 'information',

// 	async execute(message, args) {
        
//         const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 800 });
//         const 

//         const image = await chartJSNodeCanvas.renderToBuffer(chartConfig);
//         const attachment = await new AttachmentBuilder(image, { name: 'chart.png' });
//         const membersEmbed = new EmbedBuilder()
//             .setColor(config.embedColor)
//             .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({extension: 'png'}), url: message.author.displayAvatarURL({extension: 'png'}) })

//             .setImage('attachment://chart.png')
//             .setTimestamp()
//             .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

//         await message.channel.send({
//             embeds: [membersEmbed],
//             files: [attachment],
//         });
// 	},
// };

// module.exports = {
//     name: 'members',
//     description: 'サーバーのメンバー数推移を表示します。',
//     category: 'information',

// 	async execute(message, args) {


//         await message.channel.send({
//             embeds: [membersEmbed],
//             files: [attachment],
//             components: [row]
//         });
// 	},
// };