const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const logsChannelsModel = require('../../models/logsChannelsSchema');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('logs')
        .setNameLocalizations({
            'en-US': 'logs',
            'ja': 'ログ',
        })
        .setDescription('Configure settings related to logging.')
        .setDescriptionLocalizations({
            'en-US': 'Configure settings related to logging.',
            'ja': 'ログに関する設定を行います。',
        })
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
			subcommand
				.setName('set')
				.setNameLocalizations({
					'en-US': 'set',
					'ja': '設定',
				})
				.setDescription('Displays information about that guild')
				.setDescriptionLocalizations({
					'en-US': 'Displays information about that guild',
					'ja': 'ギルドの情報を表示。',
				})
                .addChannelOption(
                    option => option
                    .setName('channel')
                    .setNameLocalizations({
                        'en-US': 'channel',
                        'ja': 'チャンネル',
                    })
                    .setDescription('Select a channel to be got logs.')
                    .setDescriptionLocalizations({
                        'en-US': 'Select a channel to be got logs.',
                        'ja': 'ログを取得するチャンネルを選択。',
                    })
                    .setRequired(true)
				)
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('quit')
                .setNameLocalizations({
                    'en-US': 'quit',
                    'ja': 'やめる',
                })
                .setDescription('Stop receiving logs.')
                .setDescriptionLocalizations({
                    'en-US': 'Stop receiving logs.',
                    'ja': 'ログの受け取りをやめます。',
                })
            ),

	async execute(interaction) {
        if (interaction.options.getSubcommand() === 'set') {
            const channel = interaction.options.getChannel('channel');
            const guildData = await logsChannelsModel.findOne({ id: interaction.guild.id });
            if (!guildData) {
                const channelData = await logsChannelsModel.create({
                    guild: {
                        name: interaction.guild.name,
                        id: interaction.guild.id
                    },
                    channel: {
                        id: channel.id,
                        name: channel.name,
                    },
                    author: {
                        name: interaction.user.tag,
                        id: interaction.user.id,
                    },
                    date: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                });
                channelData.save();
                const successEmbed = new EmbedBuilder()
                    .setColor('#93ca76')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setDescription(`<#${channel.id}> でサーバーのログを受け取ります。`)
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [successEmbed]
                });
            } else {
                const failedEmbed = new EmbedBuilder()
                    .setColor('#d9333f')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setDescription(`既にこのサーバーではログを受け取るチャンネルがあるようです: <#${guildData.channel.id}>`)
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [failedEmbed]
                });
            }
        } else if (interaction.options.getSubcommand() === 'quit') {
            const guildData = await logsChannelsModel.findOne({ id: interaction.guild.id });
            if (guildData) {
                guildData.remove();
                const successEmbed = new EmbedBuilder()
                    .setColor('#93ca76')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setDescription(`ログの受け取りをやめました。`)
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [successEmbed]
                });
            } else {
                const failedEmbed = new EmbedBuilder()
                    .setColor('#d9333f')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setDescription(`このサーバーでは元からログを受けとらない設定になっています。`)
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [failedEmbed]
                });
            }
        }
	},
};
