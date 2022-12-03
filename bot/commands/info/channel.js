const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { VampireZ } = require('hypixel-api-reborn');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
        .setNameLocalizations({
            'en-US': 'channel',
            'ja': 'チャンネル',
        })
		.setDescription('Displays information about that channel.')
        .setDescriptionLocalizations({
            'en-US': 'Displays information about that channel.',
            'ja': 'チャンネルの情報を表示します。',
        })
        .setDMPermission(false)
        .addChannelOption(
            option => option
            .setName('channel')
            .setNameLocalizations({
                'en-US': 'channel',
                'ja': 'チャンネル',
            })
            .setDescription('Select a channel.')
            .setDescriptionLocalizations({
                'en-US': 'Select a channel.',
                'ja': 'チャンネルを選択。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('channel');
            var channelEmbed;

            if (!channel) return ArgumentError(interaction, channel);

            const channelType = {
                0: '#⃣テキストチャンネル',
                2: '🔊ボイスチャンネル',
                4: '💬カテゴリー💬',
                5: '📢アナウンスチャンネル',
                10: '📢サブアナウンスチャンネル',
                11: '🗨️公開スレッド',
                12: '🗨️非公開スレッド',
                13: '🔊ステージチャンネル',
                14: 'ハブチャンネル',
                15: '💭フォーラム'
            };

            if (channel.type === (0 || 5 || 10 || 11 || 12)) { //テキストチャンネル
                var lastMessage = new Date(channel.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
                if (channel.lastMessage) lastMessage = new Date(channel.lastMessage.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
                channelEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                    .setTitle(`${channel.name} の詳細`)
                    .addFields(
                        {
                            name: '__**一般:**__',
                            value: `**[名前]** ${channel.name}\n**[ID]** ${channel.id}\n**[トピック]** ${channel.topic || 'None'}\n**[年齢制限]** ${channel.nsfw ? 'あり' : 'なし'}\n**[種類]** ${channelType[channel.type]}`
                        },
                        {
                            name: '__**時間:**__',
                            value: `**[作成日時]** ${new Date(channel.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n**[更新日時]** ${lastMessage}`
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                if (channel.parent) {
                    const parent = channel.parent;
                    channelEmbed
                        .addFields(
                            {
                                name: '__**カテゴリー:**__',
                                value: `**[名前]** ${parent.name}\n**[作成日時]** ${new Date(parent.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n**[チャンネル数]** ${parent.children.cache.size}`
                            },
                        )
                }
            }
            else if (channel.type === 4) { //カテゴリー
                channelEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                    .setTitle(`${channel.name} の詳細`)
                    .addFields(
                        {
                            name: '__**一般:**__',
                            value: `**[名前]** ${channel.name}\n**[ID]** ${channel.id}\n**[種類]** ${channelType[channel.type]}`
                        },
                        {
                            name: '__**時間:**__',
                            value: `**[作成日時]** ${new Date(channel.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                if (channel.children) {
                    channelEmbed
                    .addFields(
                        {
                            name: '__**チャンネル数:**__',
                            value: `**[チャンネル数]** ${channel.children.cache.size}\n**[テキストチャンネル数]** ${channel.children.cache.filter(channel => channel.type == 0 || 5 || 10 || 11 || 12).size || '0'}\n**[ボイスチャンネル数]** ${channel.children.cache.filter(channel => channel.type == 2).size}`
                        }
                    )
                }
            }
            else if (channel.type === (2 || 13)) { //ボイスチャンネル
                channelEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                    .setTitle(`${channel.name} の詳細`)
                    .addFields(
                        {
                            name: '__**一般:**__',
                            value: `**[名前]** ${channel.name}\n**[ID]** ${channel.id}\n**[種類]** ${channelType[channel.type]}`
                        },
                        {
                            name: '__**時間:**__',
                            value: `**[作成日時]** ${new Date(channel.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                if (channel.parent) {
                    const parent = channel.parent;
                    channelEmbed
                        .addFields(
                            {
                                name: '__**カテゴリー:**__',
                                value: `**[名前]** ${parent.name}\n**[作成日時]** ${new Date(parent.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n**[チャンネル数]** ${parent.children.cache.size}`
                            },
                        )
                }
            }
            else {
                channelEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
                    .setTitle(`${channel.name} の詳細`)
                    .addFields(
                        {
                            name: '__**一般:**__',
                            value: `**[名前]** ${channel.name}\n**[ID]** ${channel.id}\n**[種類]** ${channelType[channel.type]}`
                        },
                        {
                            name: '__**時間:**__',
                            value: `**[作成日時]** ${new Date(channel.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                if (channel.parent) {
                    const parent = channel.parent;
                    channelEmbed
                        .addFields(
                            {
                                name: '__**カテゴリー:**__',
                                value: `**[名前]** ${parent.name}\n**[作成日時]** ${new Date(parent.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n**[チャンネル数]** ${parent.children.cache.size}`
                            },
                        )
                }
            };

            await interaction.followUp({
                embeds: [channelEmbed]
            });
        } catch (error) {
			return InteractionError(interaction, error);
        };
	},
};