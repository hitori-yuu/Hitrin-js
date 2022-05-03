const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const guildsModel = require('../models/guildsSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('auth')
		.setDescription('サーバーに登録されている認証権限を取得します。'),
	async execute(interaction, client) {
        const guildsData = await guildsModel.findOne({ _id: interaction.guild.id });
        const role = interaction.guild.roles.cache.find(role => role.id === guildsData.settings.auth_role)
        if (!role) return interaction.reply('サーバーに登録されている認証権限はありません。');
        if (interaction.member.roles.cache.has(role.id)) return interaction.reply('あなたはすでに認証権限を持っています。');
        const embed = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('認証成功')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription(`<@${interaction.user.id}> に <@&${role.id}> を付与しました。`)
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        await interaction.member.roles.add(role)
        await interaction.reply({ embeds: [embed] });
	},
};