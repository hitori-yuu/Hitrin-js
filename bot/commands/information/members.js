const { SlashCommandBuilder, EmbedBuilder, ChannelType, AttachmentBuilder } = require('discord.js');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData, logsData } = require('../../functions/MongoDB');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const config = require('../../config.json');

module.exports = {
    name: 'members',
    description: 'サーバーのメンバー内訳を表示します。',
    category: 'information',

	async execute(message, args) {
        const members = message.guild.members.cache;
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 800 });
        const chartConfig = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [members.filter(member => !member.user.bot).size, members.filter(member => member.user.bot).size],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                    ],
                    hoverOffset: 10
                }]
            }
        };

        const image = await chartJSNodeCanvas.renderToBuffer(chartConfig);
        const attachment = await new AttachmentBuilder(image, { name: 'chart.png' });
        const membersEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({extension: 'png'}), url: message.author.displayAvatarURL({extension: 'png'}) })
            .setTitle(`${message.guild.name} のメンバー内訳`)
            .setDescription(`🟥: ユーザー(${members.filter(member => !member.user.bot).size})\n🟦: ボット(${members.filter(member => member.user.bot).size})`)
            .setImage('attachment://chart.png')
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        await message.channel.send({
            embeds: [membersEmbed],
            files: [attachment],
        });
	},
};
