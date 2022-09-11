// const { ChannelType } = require('discord.js');

// module.exports = {
// 	name: 'messageCreate',

// 	async execute(message) {
//         if (message.author.bot || !message.guild) return;

//         if (message.channel.type === ChannelType.GuildNews) {
//           if (message.crosspostable) {
//             message.crosspost()
//             .then(() => message.react('📢'))
//             .catch(error => {
//                 console.error('[エラー] コマンド実行時にエラーが発生しました。\n内容: ' + error.message)
//             });
//           } else {
//             return;
//           }
//         }
// 	},
// };
