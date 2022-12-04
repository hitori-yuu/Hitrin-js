const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../../functions/MongoDB');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
        .setNameLocalizations({
            'en-US': 'user',
            'ja': 'ユーザー',
        })
		.setDescription('Display information about that user.')
        .setDescriptionLocalizations({
            'en-US': 'Display information about that user.',
            'ja': 'ユーザーの情報を表示します。',
        })
        .setDMPermission(false)
        .addStringOption(
            option => option
            .setName('user')
            .setNameLocalizations({
                'en-US': 'user',
                'ja': 'ユーザー',
            })
            .setDescription('Enter that user ID.')
            .setDescriptionLocalizations({
                'en-US': 'Enter that user ID.',
                'ja': 'ユーザーIDを入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
        try {
            const userId = interaction.options.getString('user');
            const user = await interaction.client.users.fetch(userId);
            if (!user) return ArgumentError(interaction, user);

            var userEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setTitle(`${user.username}#${user.discriminator} の詳細`)
                .setThumbnail(user.displayAvatarURL({extension: 'png'}), user.displayAvatarURL({extension: 'png'}))
                .addFields(
                    {
                        name: '__**一般:**__',
                        value: `**[名前]** ${user.username}\n**[ID]** ${user.id || 'None'}\n**[種類]** ${user.bot ? '🤖ボット' : '👤ユーザー'}`
                    },
                    {
                        name: '__**時間:**__',
                        value: `**[作成日時]** ${new Date(user.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            if (await isCreatedUser(user)) {
                const data = await usersData(user);
                userEmbed
                    .addFields(
                        {
                            name: '__**ボット情報**__',
                            value: `**[評価値]** ${data.evaluation}\n**[ユーザーカラー]** ${data.profile.color}\n**[誕生日]** ${data.profile.birthday.date || 'None'}\n**[説明]** ${data.profile.description || 'None'}`
                        }
                    )

            }

            await interaction.followUp({
                embeds: [userEmbed]
            });
        } catch(error) {
			return InteractionError(interaction, error);
        }
	},
};
