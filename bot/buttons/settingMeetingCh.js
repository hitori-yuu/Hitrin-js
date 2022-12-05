const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');
const Model = require('../models/guildsSchema')

module.exports = {
	id: 'settingMeetingCh',

	async execute(interaction) {
        try {
            const meetingCh = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription('**30秒以内に** ミーティングチャンネルに設定したいチャンネルのIDまたはチャンネル名を入力してください。\n30秒経過または\`キャンセル\`と入力すると以前の設定を維持します。')
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [meetingCh],
            });

            const filter = message => message.author.id === interaction.user.id;
			interaction.channel.awaitMessages({ filter, max: 1, time: 30000 })
				.then(async collected => {
                    const data = await guildsData(interaction.guild);
                    if (!data) {
                        await createGuildData(interaction.guild);
                        CustomError(interaction, 'サーバーデータがありません。再度実行してください。');
                        return;
                    }
                    const meetingChId = data.settings.meetingChannel
                    var meetingCh = 'None';
                    if (meetingChId) meetingCh = interaction.guild.channels.cache.get(meetingChId);
					if (!collected.size) return interaction.channel.send('タイムアウト');
                    if (collected.first().content === 'キャンセル') return interaction.channel.send(`以前の設定を維持します: ${meetingCh}`)
					const channel = interaction.guild.channels.cache.find((ch) => ch.name === collected.first().content) || interaction.guild.channels.cache.get(collected.first().content);
					if (!channel) return ArgumentError(interaction, channel);

                    await Model.updateOne(
                        {
                            id: interaction.guild.id,
                        },
                        {
                            $set: {
                                'settings.meetingChannel': channel.id
                            }
                        },
                    );

                    const meetingChEmbed = new EmbedBuilder()
                        .setColor('#93ca76')
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                        .setDescription(`${channel} をミーティングチャンネルに設定しました。`)
                        .setTimestamp()
                        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
                    await interaction.channel.send({
                        embeds: [meetingChEmbed],
                        ephemeral: true,
                    });
				});
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
