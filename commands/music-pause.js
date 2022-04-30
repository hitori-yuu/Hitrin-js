const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();


module.exports = {
        data: new SlashCommandBuilder()
                .setName('pause')
                .setDescription('再生中の曲一時停止します。'),
        async execute(interaction, client) {
                const channel = interaction.member.voice.channel;
                if (!channel) return interaction.reply('先にボイスチャンネルに参加してください。');
                const permissions = channel.permissionsFor(interaction.client.user);
                if (!permissions.has('CONNECT')) return error_permission(interaction, client, 'CONNECT')
                if (!permissions.has('SPEAK')) return error_permission(interaction, client, 'SPEAK')

                const queue = client.distube.getQueue(interaction)
                if (!queue) return interaction.reply('キューに曲がありません。')
                queue.pause()
                await interaction.reply('再生中の曲を一時停止しました。')
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