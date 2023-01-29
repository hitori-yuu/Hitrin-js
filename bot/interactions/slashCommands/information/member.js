const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../../../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData, logsData } = require('../../../functions/MongoDB');
const config = require('../../../config.json');

module.exports = {
    category: 'information',

	data: new SlashCommandBuilder()
		.setName('member')
        .setDescription('Displays details for the specified member.')
        .setDescriptionLocalizations({
            'en-US': 'Displays details for the specified member.',
            'ja': '指定したメンバーの詳細を表示します。',
        })
        .setDMPermission(false)
        .addUserOption(
            option => option
            .setName('member')
            .setDescription('メンバーを選択')
            .setRequired(true)
        ),

    async execute(interaction) {
        const member = interaction.options.getMember('member');

        if (!member)
            return interaction.reply({
                embeds: [CustomErrorEmbed('指定したメンバーは存在しません。')]
            });

        const memberEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ extension: 'png' }), url: member.user.displayAvatarURL({ extension: 'png' }) })
            .setTitle(`${member.displayName} の詳細`)
            .setThumbnail(member.displayAvatarURL({extension: 'png'}), member.displayAvatarURL({ extension: 'png' }))
            .addFields(
                {
                    name: '__**一般:**__',
                    value: `**[名前]** ${member.user.tag}\n**[ID]** ${member.id || 'None'}\n**[ニックネーム]** ${member.nickname || 'None'}\n**[種類]** ${member.bot ? '🤖ボット' : '👤ユーザー'}`
                },
                {
                    name: '__**時間:**__',
                    value: `**[参加日時]** <t:${Math.floor(new Date(member.joinedTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(member.joinedTimestamp) / 1000)}:R>)\n**[作成日時]** <t:${Math.floor(new Date(member.user.createdTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(member.user.createdTimestamp) / 1000)}:R>)`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        await interaction.reply({
            embeds: [memberEmbed]
        });
    },
};