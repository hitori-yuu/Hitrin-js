const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../../../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData, logsData } = require('../../../functions/MongoDB');
const config = require('../../../config.json');

module.exports = {
    category: 'information',

	data: new SlashCommandBuilder()
		.setName('user')
        .setDescription('Displays details for the specified user.')
        .setDescriptionLocalizations({
            'en-US': 'Displays details for the specified user.',
            'ja': '指定したユーザーの詳細を表示します。',
        })
        .addStringOption(
            option => option
            .setName('user')
            .setDescription('ユーザーIDを入力')
            .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.options.getString('user').toLowerCase();
        const user = await interaction.client.users.fetch(userId);

        if (!user)
            return interaction.channel.send({
                embeds: [CustomErrorEmbed('指定したユーザーは存在しません。')]
            });

        const userEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
            .setTitle(`${user.username}#${user.discriminator} の詳細`)
            .setThumbnail(user.displayAvatarURL({ extension: 'png' }), user.displayAvatarURL({ extension: 'png' }))
            .addFields(
                {
                    name: '__**一般:**__',
                    value: `**[名前]** ${user.username}\n**[ID]** ${user.id || 'None'}\n**[種類]** ${user.bot ? '🤖ボット' : '👤ユーザー'}`
                },
                {
                    name: '__**時間:**__',
                    value: `**[作成日時]** <t:${Math.floor(new Date(user.createdTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(user.createdTimestamp) / 1000)}:R>)`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        if (await isCreatedUser(user)) {
            const data = await usersData(user);
            userEmbed
                .addFields(
                    {
                        name: '__**ボット情報:**__',
                        value: `**[評価値]** ${data.evaluation}\n**[ユーザーカラー]** ${data.profile.color}\n**[誕生日]** ${data.profile.birthday.date || 'None'}\n**[説明]** ${data.profile.description || 'None'}`
                    }
                );
        };

        await interaction.reply({
            embeds: [userEmbed]
        });
    },
};