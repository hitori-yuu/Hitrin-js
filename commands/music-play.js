const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('指定したURLの動画または検索した動画を再生します。')
		.addStringOption(option => option.setName('検索').setDescription('再生したい動画のURLまたは検索ワード').setRequired(true)),
	async execute(interaction, client) {
		const arg = interaction.options.getString('検索');

        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('先にボイスチャンネルに参加してください。');
        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT')) return error_permission(interaction, client, 'CONNECT')
        if (!permissions.has('SPEAK')) return error_permission(interaction, client, 'SPEAK')

        client.distube.play(channel, arg, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
        })
        await interaction.reply('再生します。')
	},
};

function error_permission(interaction, client, permission) {
	const error = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription(`実行に必須な権限がありません: \`${permission || 'None'}\``)
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	return interaction.reply({ embeds: [error] });
}