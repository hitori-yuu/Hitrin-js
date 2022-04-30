const { SlashCommandBuilder } = require('@discordjs/builders');
const { DiscordTogether } = require('discord-together');
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('together')
		.setDescription('指定したチャンネルにて任意のアクティビティを開始します。')
		.addStringOption(option => option.setName('種類').setDescription('種類を選択').addChoice('YouTube', 'youtube').addChoice('ポーカー', 'poker').addChoice('チェス', 'chess').addChoice('チェッカーズ', 'checkers').addChoice('裏切者', 'betrayal').addChoice('釣り', 'fishing').addChoice('文字タイル', 'lettertile').addChoice('ワードスナック', 'wordsnack').setRequired(true))
        .addChannelOption(option => option.setName('チャンネル').setDescription('チャンネルを選択')),
        async execute(interaction, client) {
            const type = interaction.options.getString('種類');
            const ch = interaction.options.getChannel('チャンネル');
            if (!ch) return error_invalid(interaction, client, 'チャンネル')

            client.discordTogether = new DiscordTogether(client);
            switch (type) {
                case 'youtube':
                    await client.discordTogether.createTogetherCode(ch.id, type).then(async invite => {
                        return interaction.reply(`**YouTube**\n${invite.code}`);
                    })
                    break;
                case 'poker':
                    await client.discordTogether.createTogetherCode(ch.id, type).then(async invite => {
                        return interaction.reply(`**ポーカー**\n${invite.code}`);
                    })
                    break;
                case 'chess':
                    await client.discordTogether.createTogetherCode(ch.id, type).then(async invite => {
                        return interaction.reply(`**チェス**\n${invite.code}`);
                    })
                    break;
                case 'checkers':
                    await client.discordTogether.createTogetherCode(ch.id, type).then(async invite => {
                        return interaction.reply(`**チェッカーズ**\n${invite.code}`);
                    })
                    break;
                case 'betrayal':
                    await client.discordTogether.createTogetherCode(ch.id, type).then(async invite => {
                        return interaction.reply(`**裏切者**\n${invite.code}`);
                    })
                    break;
                case 'fishing':
                    await client.discordTogether.createTogetherCode(ch.id, type).then(async invite => {
                        return interaction.reply(`**釣り**\n${invite.code}`);
                    })
                    break;
                case 'lettertile':
                    await client.discordTogether.createTogetherCode(ch.id, type).then(async invite => {
                        return interaction.reply(`**文字タイル**\n${invite.code}`);
                    })
                    break;
                case 'wordsnack':
                    await client.discordTogether.createTogetherCode(ch.id, type).then(async invite => {
                        return interaction.reply(`**ワードスナック**\n${invite.code}`);
                    })
                    break;
            }
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
function error_unknown(interaction, client, error) {
	const err = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription('無知のエラーが発生しました。既に開発者に報告されています。')
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	const error_log = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('エラー')
		.setDescription('【エラー内容】\n' + codeBlock('js', error))
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	const log = client.channels.cache.get('919599721184628807').send({ embeds: [error_log] });
	return interaction.reply({ embeds: [err] }), log;
}