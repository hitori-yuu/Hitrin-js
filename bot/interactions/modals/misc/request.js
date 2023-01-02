const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock } = require('discord.js');

module.exports = {
	id: 'request',

	async execute(interaction) {
		const logEmbed = new EmbedBuilder()
			.setColor('#93ca76')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
			.setTitle('問い合わせを受信しました。')
			.setFields(
				{
					name: '__**送信者:**__',
					value: `**[名前]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[メンション]** <@${interaction.user.id}>`
				},
				{
					name: '**__内容:__**',
					value: codeBlock(interaction.fields.getTextInputValue('requestInput'))
				},
			)
			.setTimestamp()
			.setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

		console.log(interaction)

		await interaction.followUp({
			embeds: [SuccessEmbed('要望を送信しました。')]
		});
		await interaction.client.channels.cache.get('1048992138546925598').send({
			embeds: [logEmbed]
		});
		return;
	},
};