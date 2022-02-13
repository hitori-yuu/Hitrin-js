const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('プロフィール関連コマンド'),
	async execute(interaction, client) {
                const setting = new MessageButton()
                    .setCustomId('profile_setting')
                    .setStyle('PRIMARY')
                    .setLabel('設定');
                const status = new MessageButton()
                    .setCustomId('profile_status')
                    .setStyle('PRIMARY')
                    .setLabel('現在の状態');
                const search = new MessageButton()
                    .setCustomId('profile_search')
                    .setStyle('PRIMARY')
                    .setLabel('検索');
                const ranking = new MessageButton()
                    .setCustomId('profile_ranking')
                    .setStyle('PRIMARY')
                    .setLabel('ランキング');
                const home = new MessageEmbed()
                    .setColor('#89c3eb')
                    .setTitle('プロフィール')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
                    .setDescription('プロフィール関連コマンドの一覧です。以下のボタンをクリックし選択してください。')
                    .addFields(
                        { name: '__**設定:**__', value: '自分のプロフィールを設定します。' },
                        { name: '__**現在の状態:**__', value: '現在の自分のプロフィールを表示します。' },
                        { name: '__**検索:**__', value: '他ユーザーのプロフィールを検索し閲覧します。' },
                        { name: '__**ランキング:**__', value: 'いいね数が上位のプロフィールを表示します。__(β機能)__' },
                    )
                    .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                    .setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
                    .setTimestamp();

                await interaction.reply({ embeds: [home], components: [new MessageActionRow().addComponents([setting, status, search, ranking])] });
	},
};