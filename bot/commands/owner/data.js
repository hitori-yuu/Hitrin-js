const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: 'data',
    description: '指定された種類のデータを取得します。',
    category: 'owner',
    owner: true,

	execute(message, args) {
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
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension: 'png' }), url: message.author.displayAvatarURL({ extension: 'png' }) })
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

        message.channel.send({
            embeds: [dataEmbed],
            components: [row]
        });
	},
};