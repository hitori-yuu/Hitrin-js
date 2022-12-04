const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');
const { guildsData } = require('../functions/MongoDB');
const Model = require('../models/guildsSchema')

module.exports = {
	id: 'settingLoggingCh',

	async execute(interaction) {
        try {
            const loggingCh = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription('**30秒以内に** ログを受け取るチャンネルに設定したいチャンネルのIDまたはチャンネル名を入力してください。\n30秒経過または\`キャンセル\`と入力すると以前の設定を維持します。\n\`none\` と入力すると受け取らないよう設定できます。')
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [loggingCh],
            });

            const filter = message => message.author.id === interaction.user.id;
			interaction.channel.awaitMessages({ filter, max: 1, time: 30000 })
				.then(async collected => {
                    const data = await guildsData(interaction.guild);
                    const loggingChId = data.logging.channel.id
                    var loggingCh = 'None';
                    if (loggingChId) loggingCh = interaction.guild.channels.cache.get(loggingChId);
					if (!collected.size) return interaction.channel.send('タイムアウト');
                    if (collected.first().content === 'キャンセル') return interaction.channel.send(`以前の設定を維持します: ${loggingCh}`);
                    if (collected.first().content === 'none') {
                        await Model.updateOne(
                            {
                                id: interaction.guild.id,
                            },
                            {
                                $set: {
                                    'logging.boolean': false,
                                }
                            },
                        );
                        return interaction.channel.send('ログの受け取りを行わないよう設定しました。');
                    }
					const channel = interaction.guild.channels.cache.find((ch) => ch.name === collected.first().content) || interaction.guild.channels.cache.get(collected.first().content);
					if (!channel) return ArgumentError(interaction, channel);

                    await Model.updateOne(
                        {
                            id: interaction.guild.id,
                        },
                        {
                            $set: {
                                'logging.boolean': true,
                                'logging.channel.name': channel.name,
                                'logging.channel.id': channel.id
                            }
                        },
                    );

                    const loggingChEmbed = new EmbedBuilder()
                        .setColor('#93ca76')
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                        .setDescription(`${channel} でログを受け取るように設定しました。`)
                        .setTimestamp()
                        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
                    await interaction.channel.send({
                        embeds: [loggingChEmbed],
                        ephemeral: true,
                    });
				});
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
