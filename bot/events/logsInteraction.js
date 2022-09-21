const { InteractionType, EmbedBuilder } = require('discord.js');
const logsModel = require('../models/logsSchema');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
        try {
            const { client } = interaction;
            const command = client.slashCommands.get(interaction.commandName);
            if (!interaction.type == InteractionType.ApplicationCommand) return;
            if (!command) return;

            var args = [];
            if (!interaction.options.data[0]) {
                args = '';
            } else if (interaction.options.data) {
                if (interaction.options.data[0].options) {
                    for (let i = 0; i < interaction.options.data.length; i++) {
                        args.push(`**[${interaction.options.data[0].options[i].name.toUpperCase() || 'None'}]** ${interaction.options.data[0].options[i].value || 'None'}`);
                        if (!interaction.options.data[0].options[i]) break;
                    }
                } else if (!interaction.options.data[0].options){
                    for (let i = 0; i < interaction.options.data.length; i++) {
                        args.push(`**[${interaction.options.data[i].name.toUpperCase() || 'None'}]** ${interaction.options.data[i].value || 'None'}`);
                        if (!interaction.options.data[i]) break;
                    }
                }
            };

            if (interaction.inGuild()) {
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

                const dmEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setTitle('コマンドログ')
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
                await client.channels.cache.get('879943806118678528').send({
                    embeds: [dmEmbed]
                });
            } else if (!interaction.inGuild()) {
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

                const guildEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setTitle('コマンドログ')
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
                    )

                logData.save();
                await client.channels.cache.get('879943806118678528').send({
                    embeds: [guildEmbed]
                });
            }
        } catch (error) {
            console.error('[エラー] ログ作成時にエラーが発生しました。\n内容: ' + error.message);
        }
	},
};
