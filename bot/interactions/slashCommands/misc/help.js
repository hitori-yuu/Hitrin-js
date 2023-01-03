const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const config = require('../../../config.json');

module.exports = {
    category: 'misc',

	data: new SlashCommandBuilder()
		.setName('help')
        .setDescription('Display details for all commands or the specified command.')
        .setDescriptionLocalizations({
            'en-US': 'Display details for all commands or the specified command.',
            'ja': '全コマンドまたは指定したコマンドの詳細を表示します。',
        })
        .addStringOption(
            option => option
            .setName('command')
            .setDescription('コマンド名を入力')
        ),

    async execute(interaction) {
        const commandName = interaction.options.getString('command');

        let helpEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })

        if (commandName) {
            const command = interaction.client.slashCommands.get(commandName);
            if (!command) {
                if (~commandName.indexOf('/')) {
                    return interaction.reply({ embeds: [CustomErrorEmbed('指定したコマンドは存在しません。', `/help command:${commandName.replace('/', '')}`)] });
                }
                return interaction.reply({ embeds: [CustomErrorEmbed('指定したコマンドは存在しません。')] });
            };

            helpEmbed
                .setTitle(`/${command.data.name} の詳細`)

            var DM = '使用可能';
            if (command.data.dmPermission == false) DM = '使用不可能';

            var permissions = '誰でも使用可能';
            if (command.data.default_member_permissions) permissions = '必須権限あり';

            if (command.data.description) {
                helpEmbed.setDescription(
                    `**[English]** ${command.data.description || 'None'}\n**[日本語]** ${command.data.description_localizations.ja || 'None'}\n\n**[DM]** ${DM}\n**[必要権限]** ${permissions}`
                );
            };

            interaction.reply({
                embeds: [helpEmbed]
            });
        } else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('slashHelp')
                        .setPlaceholder('カテゴリを選択')
                        .addOptions(
                            {
                                emoji: '🏠',
                                label: 'ホームに戻る',
                                description: 'ホームに戻ります',
                                value: 'slashHelpHome',
                            },
                            {
                                emoji: '🎨',
                                label: '様々',
                                description: '他のカテゴリに分類されないような様々なコマンド',
                                value: 'slashHelpMisc',
                            },
                            {
                                emoji: '🪪',
                                label: '詳細',
                                description: '指定したものの詳細を表示するコマンド',
                                value: 'slashHelpInfo',
                            },
                            {
                                emoji: '🗣️',
								label: '読み上げ',
								description: '読み上げ系のコマンド',
								value: 'slashHelpTts',
							},
                            {
                                emoji: '🔐',
								label: '運営専用',
								description: '運営のみ使用できるコマンド',
								value: 'slashHelpOwner',
							},
                        ),
                );

            helpEmbed
                .setColor(config.embedColor)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
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
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.reply({
                embeds: [helpEmbed], components: [row]
            });
        };
    },
};