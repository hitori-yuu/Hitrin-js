const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock } = require('discord.js');

module.exports = {
	id: 'send',

	async execute(interaction) {
        const user = await interaction.client.users.fetch(interaction.fields.getTextInputValue('userIdInput'));
		const sendEmbed = new EmbedBuilder()
			.setColor('#93ca76')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            .setDescription(interaction.fields.getTextInputValue('contentInput'))
			.setFooter({ text: 'このメッセージには返信できません。\n双方向でのサポートはサポートサーバーでお願い致します。' });

		await interaction.followUp({
			embeds: [SuccessEmbed('送信しました。')]
		});
        await user.send({
            embeds: [sendEmbed]
        });
	},
};