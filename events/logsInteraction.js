const { InteractionType, EmbedBuilder, ChannelType } = require('discord.js');
const logsModel = require('../models/logsSchema');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
		const { client } = interaction;
        if (!interaction.type == InteractionType.ApplicationCommand) return;
        const command = client.slashCommands.get(interaction.commandName);

        if (command) {
            var args = [];
            if (!interaction.options.data) {
                args = 'None';
            } else {
                for (let i = 0; i < interaction.options.data.length; i++) {
                    args.push(`[${interaction.options.data[i].name}] ${interaction.options.data[i].value}`);
                    if (!interaction.options.data[i]) {
                      break;
                    }
                }
            };

            if (interaction.channel.type == ChannelType.DM) {
                const logData = await logsModel.create({
                    command: interaction.commandName,
                    args: args,
                    executer: {
                        name: interaction.user.username,
                        id:  interaction.user.id,
                    },
                    locate: {
                        name: 'DM',
                        id: 'DM',
                        dm: true,
                    },
                    date: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                });

                const logEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setTitle("コマンドログ")
                    .setThumbnail(interaction.user.displayAvatarURL({extension: 'png', size: 128}))
                    .addFields(
                        {
                            name: '__**コマンド:**__',
                            value: `**[名前]** ${interaction.commandName}`
                        },
                        {
                            name: '__**引数:**__',
                            value: `${args.join('\n')}`
                        },
                        {
                            name: '__**実行者:**__',
                            value: `**[名前]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[メンション]** <@${interaction.user.id}>`
                        },
                    )

                logData.save();
                client.channels.cache.get('879943806118678528').send({
                    embeds: [logEmbed]
                });

            } else if (interaction.channel.type == ChannelType.GuildText) {
                const logData = await logsModel.create({
                    command: interaction.commandName,
                    args: args,
                    executer: {
                        name: interaction.user.username,
                        id:  interaction.user.id,
                    },
                    locate: {
                        name: interaction.channel.name,
                        id: interaction.channel.id,
                        dm: false,
                    },
                    date: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                });

                const logEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setTitle("コマンドログ")
                    .setThumbnail(interaction.user.displayAvatarURL({extension: 'png', size: 128}))
                    .addFields(
                        {
                            name: '__**コマンド:**__',
                            value: `**[名前]** ${interaction.commandName}`
                        },
                        {
                            name: '__**引数:**__',
                            value: `${args.join('\n') || 'None'}`
                        },
                        {
                            name: '__**実行者:**__',
                            value: `**[名前]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[メンション]** <@${interaction.user.id}>`
                        },
                        {
                            name: '__**チャンネル:**__',
                            value: `**[名前]** ${interaction.channel.name}\n**[ID]** ${interaction.channel.id}`
                        },
                        {
                            name: '__**サーバー:**__',
                            value: `**[名前]** ${interaction.guild.name}\n**[ID]** ${interaction.guild.id}\n**[所有者]** <@${interaction.guild.ownerId}>`
                        },
                    )

                logData.save();
                client.channels.cache.get('879943806118678528').send({
                    embeds: [logEmbed]
                });
            }
        }
	},
};
