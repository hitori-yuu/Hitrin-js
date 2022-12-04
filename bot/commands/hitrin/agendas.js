const { EmbedBuilder, SlashCommandBuilder, codeBlock } = require('discord.js');
const { agendas } = require('../../functions/meetings');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('agendas')
        .setNameLocalizations({
            'en-US': 'agendas',
            'ja': '議題',
        })
        .setDescription('Send an inquiry to the Bot\'s management.')
        .setDescriptionLocalizations({
            'en-US': 'Send an inquiry to the Bot\'s management.',
            'ja': '全コマンドまたは特定のコマンドの詳細を表示します。',
        })
		.setDMPermission(false),

	async execute(interaction) {
		try {
            console.log(await agendas(interaction.guild))
            // const inquiryEmbed = new EmbedBuilder()
            //     .setColor('#93ca76')
            //     .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            //     .addFields(
            //         {
            //             name: '__**議題:**__',
            //             value: content
            //         },
            //         {
            //             name: '__**理由:**__',
            //             value: reason || 'None'
            //         },
            //     )
            //     .setTimestamp()
            //     .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            // interaction.followUp({
            //     embeds: [inquiryEmbed]
            // });
            interaction.followUp({
                content: '情報を取得中...'
            });
		} catch (error) {
			return InteractionError(interaction, error);
		}
	},
};
