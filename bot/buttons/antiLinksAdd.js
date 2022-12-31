const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder,ButtonBuilder, ButtonStyle, codeBlock } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');
const Model = require('../models/guildsSchema')

module.exports = {
	id: 'antiLinksAdd',

	async execute(interaction) {
        try {
            const loggingCh = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription('**30秒以内に** 無効にしたいリンクを入力してください。\n30秒経過すると以前の設定を維持します。')
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [loggingCh],
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

                    const before = await antiLinks(data);
                    var beforeLinks = before;
                    if (before.length  > 1) beforeLinks = before.join(', ');

                    const antiLinksEmbed = new EmbedBuilder()
                        .setColor('#59b9c6')
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                        .setFields(
                            {
                                name: '**__無効リンク:__**',
                                value: codeBlock(beforeLinks || 'None')
                            },
                        )
                        .setTimestamp()
                        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                    if (!collected.size) return interaction.channel.send({ embeds: [antiLinksEmbed], ephemeral: true });
					if (!collected.first().content) return ArgumentError(interaction, collected.first().content);
                    if (before.includes(collected.first().content)) return CustomError(interaction, 'そのリンクはすでに追加されています');

                    await Model.updateOne(
                        {
                            id: interaction.guild.id,
                        },
                        {
                            $push: {
                                'autoMod.antiLinks.links': collected.first().content
                            }
                        },
                    );

                    const after = await antiLinks(data);
                    var afterLinks = after;
                    if (after.length > 1) afterLinks = after.join(', ');
                    const antiLinksAddedEmbed = new EmbedBuilder()
                        .setColor('#93ca76')
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                        .setFields(
                            {
                                name: '**__無効リンク:__**',
                                value: codeBlock(afterLinks || 'None')
                            },
                        )
                        .setTimestamp()
                        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                    await interaction.channel.send({
                        embeds: [antiLinksAddedEmbed],
                        ephemeral: true,
                    });
				});
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};

async function antiLinks(data) {
    var antiLinks = [];
    if (data.autoMod.antiLinks.links) {
        data.autoMod.antiLinks.links.forEach(link => {
            antiLinks.push(link);
        });
        return antiLinks;
    };
}