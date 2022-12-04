const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { logsData } = require('../../functions/MongoDB');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
        .setNameLocalizations({
            'en-US': 'bot',
            'ja': 'ボット',
        })
		.setDescription('Display information about this bot.')
        .setDescriptionLocalizations({
            'en-US': 'Display information about this bot.',
            'ja': 'ボットの情報を表示します。',
        })
        .setDMPermission(false),

	async execute(interaction) {
        try {
            const { client } = interaction;
            const author = client.users.cache.get('874184214130602015');
            const logs = await logsData();

            const clientEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setTitle(`${client.user.username} の詳細`)
                .setThumbnail(client.user.displayAvatarURL({ extension: 'png' }), client.user.displayAvatarURL({ extension: 'png' }))
                .addFields(
                    {
                        name: '__**一般:**__',
                        value: `**[名前]** ${client.user.username}\n**[ID]** ${client.user.id || 'None'}\n**[作成者]** <@${author.id}>`
                    },
                    {
                        name: '__**時間:**__',
                        value: `**[最終起動]** ${new Date(client.readyAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
                    },
                    {
                        name: '__**統計:**__',
                        value: `**[実行コマンド数]** ${logs.length}\n**[発生エラー数]** ${client.errors.size || '0'}\n**[ユーザー数]** ${client.users.cache.size}\n**[サーバー数]** ${client.guilds.cache.size}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [clientEmbed]
            });
        } catch (error) {
			return InteractionError(interaction, error);
        }
	},
};
