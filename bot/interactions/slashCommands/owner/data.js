const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { config } = require('dotenv');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { loadCommands } = require('../../../handlers/commands');
const { loadEvents } = require('../../../handlers/events');

module.exports = {
	category: 'owner',

	data: new SlashCommandBuilder()
		.setName('data')
		.setDescription('Obtains data of the specified type.')
        .setDescriptionLocalizations({
            'en-US': 'Obtains data of the specified type.',
            'ja': '指定した種類のデータを取得します。',
        }),

	async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('data')
                    .setPlaceholder('取得する種類を選択')
                    .addOptions(
                        {
                            label: 'メンバー数',
                            description: 'メンバーの数の取得を行います。',
                            value: 'dataMembers',
                        },
                        {
                            label: 'メッセージ数',
                            description: 'メッセージの数の取得を行います。',
                            value: 'dataMessages',
                        },
                    ),
            );

        const dataEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
            .setTitle('データ取得')
            .addFields(
                {
                    name: 'メンバー数',
                    value: 'メンバーの数の取得を行います。'
                },
                {
                    name: 'メッセージ数',
                    value: 'メッセージの数の取得を行います。'
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        await interaction.reply({
            embeds: [dataEmbed],
            components: [row]
        });
	},
};