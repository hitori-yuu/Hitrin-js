const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData, logsData } = require('../../../functions/MongoDB');
const config = require('../../../config.json');

module.exports = {
    category: 'information',

	data: new SlashCommandBuilder()
		.setName('bot')
        .setDescription('Displays this bot details.')
        .setDescriptionLocalizations({
            'en-US': 'Displays this bot details.',
            'ja': 'ボットの詳細を表示します。',
        }),

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
                        value: `**[名前]** ${client.user.username}\n**[ID]** ${client.user.id || 'None'}\n**[作成者]** <@${author.id}>\n**[バージョン]** ${config.version}`
                    },
                    {
                        name: '__**時間:**__',
                        value: `**[最終起動]** <t:${Math.floor(new Date(client.readyTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(client.readyTimestamp) / 1000)}:R>)`
                    },
                    {
                        name: '__**統計:**__',
                        value: `**[実行コマンド数]** ${logs.length}\n**[発生エラー数]** ${client.errors.size || '0'}\n**[ユーザー数]** ${client.users.cache.size}\n**[サーバー数]** ${client.guilds.cache.size}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.reply({
                embeds: [clientEmbed]
            });
        } catch (error) {
            return console.error(error);
        }
	},
};