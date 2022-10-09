const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
        .setNameLocalizations({
            'en-US': 'channel',
            'ja': 'チャンネル',
        })
		.setDescription('Displays information about that channel.')
        .setDescriptionLocalizations({
            'en-US': 'Displays information about that channel.',
            'ja': 'チャンネルの情報を表示します。',
        })
        .setDMPermission(false)
        .addChannelOption(
            option => option
            .setName('channel')
            .setNameLocalizations({
                'en-US': 'channel',
                'ja': 'チャンネル',
            })
            .setDescription('Select a channel.')
            .setDescriptionLocalizations({
                'en-US': 'Select a channel.',
                'ja': 'チャンネルを選択。',
            })
            .setRequired(true)
        ),

	async execute(interaction, client) {
        try {
            const channel = interaction.options.getChannel('channel');

            if (!channel) return ArgumentError(interaction, channel);

            console.log(channel.permissionOverwrites.cache);

            const channelEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setTitle(`${channel.name} の詳細`)
                .addFields(
                    {
                        name: '__**一般:**__',
                        value: `**[名前]** ${channel.name}\n**[ID]** ${channel.id}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [channelEmbed]
            });
        } catch (error) {
			return InteractionError(error, interaction);
        }
	},
};

// {
//     name: '__**権限:**__',
//     value: `**[許可]**\n${channel.permissionOverwrites.cache[0].allow.toArray()}\n\n**[禁止]**\n${channel.permissionOverwrites.cache[0].deny.toArray()}`
// },
// {
//     name: '__**時間:**__',
//     value: `**[作成日時]** ${new Date(channel.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
// },