const { InteractionType, EmbedBuilder } = require('discord.js');
const { Error } = require('../handlers/error');
const usersModel = require('../models/usersSchema');
const guildsModel = require('../models/guildsSchema');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
        try {
            const { client } = interaction;
            if (!interaction.type == InteractionType.ApplicationCommand) return;
            const command = client.slashCommands.get(interaction.commandName);

            if (command) {
                if (interaction.guild) {
                    const guildsData = await guildsModel.find();
                    const guild_data = guildsData.filter(data => data.id  === interaction.guild.id);
                    if (guild_data.length <= 0) {
                        const guildData = await guildsModel.create({
                            id: interaction.guild.id,
                            name: interaction.guild.name,
                            settings: {
                                autoMod: false,
                                autoPublish: true,
                                globalBan: true,
                                authRole: 'None',
                            },
                            createDate: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                        });

                        const logEmbed = new EmbedBuilder()
                            .setColor('#59b9c6')
                            .setTitle('サーバー初期設定')
                            .setThumbnail(interaction.user.displayAvatarURL({extension: 'png', size: 128}))
                            .setDescription(`サーバーの初期設定が完了しました。`)
                            .addFields(
                                {
                                    name: '__**サーバー:**__',
                                    value: `**[名前]** ${interaction.guild.name}\n**[ID]** ${interaction.guild.id}`
                                },
                            )

                        guildData.save();
                        client.channels.cache.get('879943806118678528').send({
                            embeds: [logEmbed]
                        });
                    }
                }

                const usersData = await usersModel.find();
                const user_data = usersData.filter(data => data.id  === interaction.user.id);
                if (user_data.length <= 0) {
                    const userData = await usersModel.create({
                        id: interaction.user.id,
                        name: interaction.user.username,
                        tos: false,
                        evaluation: 10,
                        speaker: 5,
                        profile: {
                            avatar: interaction.user.displayAvatarURL({ format: 'png'}),
                            color: 'BLACK',
                            description: null,
                            birthday: {
                                date: null,
                                public: false,
                            }
                        },
                        createDate: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                    });

                    const logEmbed = new EmbedBuilder()
                        .setColor('#59b9c6')
                        .setTitle('ユーザー初期設定')
                        .setThumbnail(interaction.user.displayAvatarURL({extension: 'png', size: 128}))
                        .setDescription(`ユーザーの初期設定が完了しました。`)
                        .addFields(
                            {
                                name: '__**ユーザー:**__',
                                value: `**[名前]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}`
                            },
                        )

                    userData.save();
                    client.channels.cache.get('879943806118678528').send({
                        embeds: [logEmbed]
                    });
                } else return;
            }
        } catch (error) {
			return Error(error);
        }
	},
};
