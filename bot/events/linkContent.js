const { ChannelType, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { Error } = require('../handlers/error');
const Canvas = require('canvas');
const path = require('path');

module.exports = {
    name: 'messageCreate',

    async execute(message) {
        try {
            if (message.author.bot || !message.guild) return;
            const content = message.cleanContent;

            if (content.match('https://discord.com/channels/')) {
                const messages = content.split('/');
                const Guild = message.client.guilds.cache.get(messages[4]);
                const Channel = Guild.channels.cache.get(messages[5]);
                await Channel.messages.fetch(messages[6]).then(async msg => {
                    if (!msg.content) return;
                    // const canvas = Canvas.createCanvas(800, 100);
                    // const ctx = canvas.getContext('2d');
                    // const background = await Canvas.loadImage(
                    //     path.join(__dirname, '../assets/background.jpg')
                    // )
                    // let x = 0;
                    // let y = 0;
                    // ctx.drawImage(background, x, y);

                    // const pfp = await Canvas.loadImage(
                    //     msg.author.displayAvatarURL({extension: 'png'})
                    // );
                    // x = canvas.width / 5.8 - pfp.width;
                    // y = canvas.height / 2 - pfp.height / 2;
                    // ctx.arc(50, 60, 40, 0, Math.PI * 2, true);
                    // ctx.drawImage(pfp, x, 0, 100, 100);

                    // ctx.fillStyle = '#FFFFFF';
                    // ctx.font = '27px Meiryo';
                    // let text = `${msg.author.username}#${msg.author.discriminator}`;
                    // x = canvas.width / 3 - pfp.width;
                    // y = canvas.height / 2.8 - pfp.height;
                    // ctx.fillText(text, x, y + pfp.height);

                    // ctx.font = '30px Meiryo';
                    // text = msg.content;
                    // if (msg.content.length > 35) ctx.font = '15px Meiryo';
                    // else if (msg.content.length > 50) ctx.font = '10px Meiryo';
                    // else if (msg.content.length > 100) ctx.font = '5px Meiryo';
                    // else ctx.font = '2px Meiryo';
                    // x = canvas.width / 4 - pfp.width / 2;
                    // y = canvas.height / 1.2 - pfp.height;
                    // ctx.fillText(text, x, y + pfp.height)

                    const MessageEmbed = new EmbedBuilder()
                        .setColor('#59b9c6')
                        .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL({extension: 'png'}), url: msg.author.displayAvatarURL({extension: 'png'}) })
                        .setDescription(msg.content)
                        .setTimestamp(new Date(msg.createdAt))
                        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                    // const attachment = new AttachmentBuilder(canvas.toBuffer());
                    // await message.channel.send({
                    //     files: [attachment]
                    // });

                    await message.channel.send({
                        embeds: [MessageEmbed]
                    });
                });
            }
        } catch(error) {
            return Error(error);
        }
    },
};


/*
const image = await new Canvas.Message()
    .setUsername(`${msg.author.username}#${msg.author.discriminator}`)
    .setContent(msg.content)
    .setAvatar(msg.author.displayAvatarURL({extension: 'png'}))
    .setTextColor()
    .setBackGround('#424549')
    .toAttachment();
*/