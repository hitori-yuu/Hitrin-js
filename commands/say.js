const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('任意の文字列をボットに言わせます。')
		.addStringOption(option => option.setName('言葉').setDescription('言わせたい言葉を入力')),
	async execute(interaction) {
		const arg = interaction.options.getString('言葉') || '.';
		if (!arg) return error_invalid(interaction, client, '言葉')
		if (arg.includes('@everyone' || '@here')) return;
		await interaction.reply(arg);
	},
};

function error_invalid(interaction, client, invalid) {
	const error = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription(`実行に必須なパラメータが無効です: \`${invalid || 'None'}\``)
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	return interaction.reply({ embeds: [error] });
}