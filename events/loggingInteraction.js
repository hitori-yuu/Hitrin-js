const { InteractionType, EmbedBuilder } = require('discord.js');
const logsChannelsModel = require('../models/logsChannelsSchema');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
		const { client } = interaction;
        if (!interaction.type == InteractionType.ApplicationCommand) return;
        const command = client.slashCommands.get(interaction.commandName);

        if (command) {
            const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setTitle("コマンドログ")
            .setThumbnail(interaction.user.displayAvatarURL({extension: 'png'}))
            .addFields(
                {
                    name: '__**コマンド:**__',
                    value: `**[名前]** ${interaction.commandName}`
                },
                {
                    name: '__**実行者:**__',
                    value: `**[名前]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[メンション]** <@${interaction.user.id}>`
                },
                {
                    name: '__**チャンネル:**__',
                    value: `**[名前]** ${interaction.channel.name}\n**[ID]** ${interaction.channel.id}`
                },
            )

			const guildsData = await logsChannelsModel.findOne({ id: interaction.guild.id });
            if (guildsData) {
                client.channels.cache.get(guildsData.channel.id).send({embeds: [logEmbed]});
            } else {
                return;
            }
        }
	},
};
