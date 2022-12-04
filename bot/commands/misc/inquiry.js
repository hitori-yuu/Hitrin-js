const { EmbedBuilder, SlashCommandBuilder, codeBlock } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('inquiry')
        .setNameLocalizations({
            'en-US': 'inquiry',
            'ja': '問い合わせ',
        })
        .setDescription('Send an inquiry to the developer.')
        .setDescriptionLocalizations({
            'en-US': 'Send an inquiry to the developer.',
            'ja': '開発者に問い合わせを送信します。',
        })
		.setDMPermission(true)
        .addStringOption(
            option => option
            .setName('content')
            .setNameLocalizations({
                'en-US': 'content',
                'ja': '内容',
            })
            .setDescription('Enter the inquiry details.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the inquiry details.',
                'ja': '問い合わせの内容を入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
		try {
            const content = interaction.options.getString('content');

            if (!content) return ArgumentError(interaction, content);

            const inquiryEmbed = new EmbedBuilder()
                .setColor('#93ca76')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setDescription(`以下の内容を送信しました。\n問題解決等のため開発者から直接連絡が来る場合がありますのでご了承下さい。\n${codeBlock(content)}`)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
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
                        value: codeBlock(content)
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [inquiryEmbed]
            });
            await interaction.client.channels.cache.get('1048992138546925598').send({
                embeds: [logEmbed]
            });
		} catch (error) {
			return InteractionError(interaction, error);
		}
	},
};
