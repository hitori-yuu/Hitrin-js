const { Collection, ChannelType, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logsModel = require('../models/logsSchema');
const config = require('../config.json');

const escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
	name: 'messageCreate',

	async execute(message) {
        try {
            const { client, guild, channel, content, author } = message;

            const checkPrefix = config.prefix.toLowerCase();
            const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(checkPrefix)})\\s*`);

            if (!prefixRegex.test(content.toLowerCase())) return;

            const [matchedPrefix] = content.toLowerCase().match(prefixRegex);
            const args = content.slice(matchedPrefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (!message.content.startsWith(matchedPrefix) || message.author.bot) return;

            const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) return;

            let logData;
            let commandEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: `${config.prefix}${commandName}`})
                .setThumbnail(message.author.displayAvatarURL({ extension: 'png' }))
                .addFields(
                    {
                        name: '__**引数:**__',
                        value: args.join('\n') || 'None'
                    },
                    {
                        name: '__**実行者:**__',
                        value: `**[名前]** ${message.author.tag}\n**[ID]** ${message.author.id}\n**[メンション]** <@${message.author.id}>`
                    },
                );

            if (message.inGuild()) {
                logData = await logsModel.create({
                    command: commandName,
                    args: args.join('\n') || 'None',
                    executer: {
                        name: message.author.username,
                        id:  message.author.id,
                    },
                    locate: {
                        name: message.channel.name,
                        id: message.channel.id,
                        dm: false,
                    },
                    createdDate: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                });

                commandEmbed
                    .addFields(
                        {
                            name: '__**チャンネル:**__',
                            value: `**[名前]** ${message.channel.name}\n**[ID]** ${message.channel.id}`
                        },
                        {
                            name: '__**サーバー:**__',
                            value: `**[名前]** ${message.guild.name}\n**[ID]** ${message.guild.id}\n**[所有者]** <@${message.guild.ownerId}>`
                        },
                    );
            } else if (!message.inGuild()) {
                logData = await logsModel.create({
                    command: commandName,
                    args: args.join('\n') || 'None',
                    executer: {
                        name: message.author.username,
                        id:  message.author.id,
                    },
                    locate: {
                        name: 'DM',
                        id: 'DM',
                        dm: true,
                    },
                    createdDate: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                });
            } else return;

            logData.save();
            await client.channels.cache.get('1022444125980741642').send({
                embeds: [commandEmbed]
            });
        } catch (error) {
			return console.error(error);
        }
	},
};