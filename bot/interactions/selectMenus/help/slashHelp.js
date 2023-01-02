const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
	id: 'slashHelp',

	async execute(interaction) {
        const selected = interaction.values[0];

        let helpEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        switch (selected) {
            case 'slashHelpHome':
                helpEmbed
                    .addFields(
                        {
                            name: '**🎨 様々 🎨**',
                            value: `他のカテゴリに分類されないような様々なコマンド。 ${interaction.client.slashCommandsMisc.size}コマンド`
                        },
                        {
                            name: '**🪪 詳細 🪪**',
                            value: `指定したものの詳細を表示するコマンド。 ${interaction.client.slashCommandsInfo.size}コマンド`
                        },
                        {
                            name: '**🗣️ 読み上げ 🗣️**',
                            value: `読み上げ系のコマンド。 ${interaction.client.slashCommandsTts.size}コマンド`
                        },
                        {
                            name: '**🔐 運営専用 🔐**',
                            value: `運営のみ使用できるコマンド。 ${interaction.client.slashCommandsOwner.size}コマンド`
                        },
                    );
                break;
            case 'slashHelpMisc':
                interaction.client.slashCommandsMisc.forEach(command => {
                    helpEmbed
                        .setTitle('カテゴリ 様々')
                        .addFields(
                            {
                                name: `**/${command.data.name}**`,
                                value: `\`En:\` ${command.data.description}\n\`Ja:\` ${command.data.description_localizations.ja || 'None'}`
                            }
                    );
                });
                break;
            case 'slashHelpInfo':
                interaction.client.slashCommandsInfo.forEach(command => {
                    helpEmbed
                    .setTitle('カテゴリ 詳細')
                        .addFields(
                            {
                                name: `**/${command.data.name}**`,
                                value: `\`En:\` ${command.data.description}\n\`Ja:\` ${command.data.description_localizations.ja || 'None'}`
                            }
                    );
                });
                break;
            case 'slashHelpTts':
                interaction.client.slashCommandsTts.forEach(command => {
                    helpEmbed
                    .setTitle('カテゴリ 読み上げ')
                        .addFields(
                            {
                                name: `**/${command.data.name}**`,
                                value: `\`En:\` ${command.data.description}\n\`Ja:\` ${command.data.description_localizations.ja || 'None'}`
                            }
                    );
                });
                break;
            case 'slashHelpOwner':
                if (interaction.user.id !== config.owner) {
                    helpEmbed
                        .setTitle('カテゴリ 運営専用')
                        .setDescription('この機能は運営のみ使用できます。')
                    break;
                };
                interaction.client.slashCommandsOwner.forEach(command => {
                    helpEmbed
                    .setTitle('カテゴリ 運営専用')
                        .addFields(
                            {
                                name: `**/${command.data.name}**`,
                                value: `\`En:\` ${command.data.description}\n\`Ja:\` ${command.data.description_localizations.ja || 'None'}`
                            }
                    );
                });
                break;
        }

        return await interaction.update({
			embeds: [helpEmbed]
		});
	},
};