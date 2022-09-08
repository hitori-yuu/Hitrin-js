const { InteractionType, EmbedBuilder } = require('discord.js');
const usersModel = require('../models/usersSchema');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
		const { client } = interaction;
        if (!interaction.type == InteractionType.ApplicationCommand) return;
        const command = client.slashCommands.get(interaction.commandName);

        if (command) {
            try {
                const usersData = await usersModel.find();
                const data = usersData.filter(data => data.id  === interaction.user.id);
                if (data.length <= 0) {
                    const userData = await usersModel.create({
                        id: interaction.user.id,
                        name: interaction.user.username,
                        tos: false,
                        evaluation: 10,
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
                        .setTitle("ユーザー初期設定")
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
            } catch (error) {
                console.error('[エラー] ユーザー初期設定時にエラーが発生しました。\n内容: ' + error.message);
            }
        }
	},
};
