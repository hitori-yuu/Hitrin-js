const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'analytics',
    description: 'サーバーのアナリティクスを表示します。',
    category: 'information',

	async execute(message, args) {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('analytics')
                    .setPlaceholder('表示する種類を選択')
                    .addOptions(
                        {
                            label: 'メンバーの内訳',
                            description: 'メンバーのユーザーとボットの内訳を表示します。',
                            value: 'analyticsBreakdown',
                        },
                        {
                            label: 'メンバー数の推移',
                            description: 'メンバーの数の推移を表示します。',
                            value: 'analyticsMembers',
                        },
                        {
                            label: 'メッセージ数の推移',
                            description: 'メッセージの数の推移を表示します。',
                            value: 'analyticsMessages',
                        },
                    ),
            );


        const analyticsEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension: 'png' }), url: message.author.displayAvatarURL({ extension: 'png' }) })
            .setTitle('サーバーのアナリティクス')
            .addFields(
                {
                    name: 'メンバーの内訳',
                    value: 'メンバーのユーザーとボットの内訳を表示します。'
                },
                {
                    name: 'メンバー数の推移',
                    value: 'メンバーの数の推移を表示します。'
                },
                {
                    name: 'メッセージ数の推移',
                    value: 'メッセージの数の推移を表示します。'
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        await message.channel.send({
            embeds: [analyticsEmbed],
            components: [row]
        });
	},
};
