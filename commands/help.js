const { SlashCommandBuilder, } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('ヘルプを表示します。'),
	async execute(interaction, client) {

		const row = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('help_select')
				.setPlaceholder('表示したいカテゴリを選択')
				.addOptions([
					{
						label: 'ヘルプ',
						description: '「ヘルプ」カテゴリを表示',
						value: 'select_help',
					},
					{
						label: '設定',
						description: '「設定」カテゴリを表示',
						value: 'select_set',
					},
					{
						label: '便利',
						description: '「便利」カテゴリを表示',
						value: 'select_useful',
					},
					{
						label: '遊び',
						description: '「遊び」カテゴリを表示',
						value: 'select_game',
					},
					{
						label: '管理',
						description: '「管理」カテゴリを表示',
						value: 'select_management',
					},
					{
						label: '音楽',
						description: '「音楽」カテゴリを表示',
						value: 'select_music',
					},
				]),
		);

		const embed = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('ヘルプ')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('下のセレクトメニューから表示したいカテゴリを選択してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		await interaction.reply({ embeds: [embed], components: [row] });
	},
};