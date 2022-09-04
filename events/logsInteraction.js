const { InteractionType, EmbedBuilder, ChannelType } = require('discord.js');
const logsModel = require('../models/logsSchema');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
		const { client } = interaction;
        if (!interaction.type == InteractionType.ApplicationCommand) return;
        const command = client.slashCommands.get(interaction.commandName);

        if (command) {
            var ch_name = interaction.channel.name
            var ch_id = interaction.channel.id
            var ch_dm = false
            if (interaction.channel.type === ChannelType.DM) ch_dm = true;
            if (ch_dm == true) ch_name = ch_id = 'None'


            var options = 'None';
            if (interaction.options.data[0]) options = `[${interaction.options.data[0].name}] ${interaction.options.data[0].value}`;

            const logData = await logsModel.create({
                type: 'SLASH_COMMAND',
                command: interaction.commandName,
                args: options,
                executer: {
                    name: interaction.user.username,
                    id:  interaction.user.id,
                },
                locate: {
                    name: ch_name,
                    id: ch_id,
                    dm: ch_dm,
                },
                date: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
            });

            var ch = `${interaction.channel.name}(${interaction.channel.id})`
            if (ch_dm == true) ch = 'DM';

            const logEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setTitle("コマンドログ")
            .setThumbnail(interaction.user.displayAvatarURL({extension: 'png', size: 128}))
            .addFields(
                {
                    name: '__**コマンド:**__',
                    value: `**[名前]** ${interaction.commandName}\n**[引数]** ${options}`
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
	},
};