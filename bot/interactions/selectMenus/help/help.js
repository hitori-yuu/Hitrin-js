const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
	id: 'help',

	async execute(interaction) {
        const selected = interaction.values[0];

        let helpEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        switch (selected) {
            case 'helpHome':
                helpEmbed
                    .addFields(
                        {
                            name: '**🎨 様々 🎨**',
                            value: `他のカテゴリに分類されないような様々なコマンド。 ${interaction.client.commandsMisc.size}コマンド`
                        },
                        {
                            name: '**🪪 詳細 🪪**',
                            value: `指定したものの詳細を表示するコマンド。 ${interaction.client.commandsInfo.size}コマンド`
                        },
                        {
                            name: '**🗣️ 読み上げ 🗣️**',
                            value: `読み上げ系のコマンド。 ${interaction.client.commandsTts.size}コマンド`
                        },
                        {
                            name: '**🔐 運営専用 🔐**',
                            value: `運営のみ使用できるコマンド。 ${interaction.client.commandsOwner.size}コマンド`
                        },
                    );
                break;
            case 'helpMisc':
                interaction.client.commandsMisc.forEach(command => {
                    helpEmbed
                        .setTitle('カテゴリ 様々')
                        .addFields(
                            {
                                name: `**${config.prefix}${command.name}**`,
                                value: command.description
                            }
                    );
                });
                break;
            case 'helpInfo':
                interaction.client.commandsInfo.forEach(command => {
                    helpEmbed
                    .setTitle('カテゴリ 詳細')
                        .addFields(
                            {
                                name: `**${config.prefix}${command.name}**`,
                                value: command.description
                            }
                    );
                });
                break;
            case 'helpTts':
                interaction.client.commandsTts.forEach(command => {
                    helpEmbed
                    .setTitle('カテゴリ 読み上げ')
                        .addFields(
                            {
                                name: `**${config.prefix}${command.name}**`,
                                value: command.description
                            }
                    );
                });
                break;
            case 'helpOwner':
                if (interaction.user.id !== config.owner) {
                    helpEmbed
                        .setTitle('カテゴリ 運営専用')
                        .setDescription('この機能は運営のみ使用できます。')
                    break;
                };
                interaction.client.commandsOwner.forEach(command => {
                    helpEmbed
                    .setTitle('カテゴリ 運営専用')
                        .addFields(
                            {
                                name: `**${config.prefix}${command.name}**`,
                                value: command.description
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