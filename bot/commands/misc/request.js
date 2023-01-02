const fs = require('fs');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, codeBlock } = require('discord.js')
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'request',
    aliases: ['req'],
	description: '運営に新機能やバグ修正などの要望を送信します。',
	usage: '[要望]',
    category: 'misc',
	args: true,

	execute(message, args) {
        const content = args[0];

		const logEmbed = new EmbedBuilder()
			.setColor('#93ca76')
			.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({extension: 'png'}), url: message.author.displayAvatarURL({extension: 'png'}) })
			.setTitle('問い合わせを受信しました。')
			.setFields(
				{
					name: '__**送信者:**__',
					value: `**[名前]** ${message.author.tag}\n**[ID]** ${message.author.id}\n**[メンション]** <@${message.author.id}>`
				},
				{
					name: '**__内容:__**',
					value: codeBlock(content)
				},
			)
			.setTimestamp()
			.setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

		message.channel.send({
			embeds: [SuccessEmbed('要望を送信しました。')]
		});
		message.client.channels.cache.get('1048992138546925598').send({
			embeds: [logEmbed]
		});
	},
};