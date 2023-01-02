const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../functions/embeds');
const config = require('../../config.json');

module.exports = {
    name: 'help',
    description: '指定したコマンドの詳細または全てのコマンドを表示します。',
    usage: '[コマンド名]',
    category: 'misc',

    async execute(message, args) {
        let helpEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension: 'png' }), url: message.author.displayAvatarURL({ extension: 'png' }) })

        if (args[0]) {
            const commandName = args[0].toLowerCase();
            const command = message.client.commands.get(commandName) || message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) {
                if (~commandName.indexOf('h.')) {
                    return message.channel.send({ embeds: [CustomErrorEmbed('指定したコマンドは存在しません。', `${config.prefix}help ${commandName.replace(`${config.prefix}`, '')}`)] });
                }
                return message.channel.send({ embeds: [CustomErrorEmbed('指定したコマンドは存在しません。')] });
            };

            helpEmbed.setTitle(`${config.prefix}${command.name} の詳細`);

            if (command.description) helpEmbed
                .setDescription(command.description)
                .addFields(
                    {
                        name: '__**クールダウン:**__',
                        value: `${command.cooldown || 3} 秒`,
                        inline: true,
                    },
                );

            if (command.aliases) helpEmbed.addFields(
                    {
                        name: '__**別名:**__',
                        value: `\`${command.aliases.join(', ')}\``,
                        inline: true,
                    },
                );
            if (command.usage) helpEmbed.addFields(
                    {
                        name: '__**使用方法:**__',
                        value: `${config.prefix}${command.name} ${command.usage}`,
                        inline: true,
                    },
                );

            message.channel.send({
                embeds: [helpEmbed]
            });
        } else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('help')
                        .setPlaceholder('カテゴリを選択')
                        .addOptions(
                            {
                                label: '🏠 | ホームに戻る',
                                description: 'ホームに戻ります',
                                value: 'helpHome',
                            },
                            {
                                label: '🎨 | 様々',
                                description: '他のカテゴリに分類されないような様々なコマンド',
                                value: 'helpMisc',
                            },
                            {
                                label: '🪪 | 詳細',
                                description: '指定したものの詳細を表示するコマンド',
                                value: 'helpInfo',
                            },
                            {
								label: '🗣️ | 読み上げ',
								description: '読み上げ系のコマンド',
								value: 'helpTts',
							},
                            {
								label: '🔐 | 運営専用',
								description: '運営のみ使用できるコマンド',
								value: 'helpOwner',
							},
                        ),
                );

            helpEmbed
                .setColor(config.embedColor)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension: 'png' }), url: message.author.displayAvatarURL({ extension: 'png' }) })
                .addFields(
                    {
                        name: '**🎨 様々 🎨**',
                        value: `他のカテゴリに分類されないような様々なコマンド。 ${message.client.commandsMisc.size}コマンド`
                    },
                    {
                        name: '**🪪 詳細 🪪**',
                        value: `指定したものの詳細を表示するコマンド。 ${message.client.commandsInfo.size}コマンド`
                    },
                    {
                        name: '**🗣️ 読み上げ 🗣️**',
                        value: `読み上げ系のコマンド。 ${message.client.commandsTts.size}コマンド`
                    },
                    {
                        name: '**🔐 運営専用 🔐**',
                        value: `運営のみ使用できるコマンド。 ${message.client.commandsOwner.size}コマンド`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            message.channel.send({
                embeds: [helpEmbed], components: [row]
            });
        };
    },
};