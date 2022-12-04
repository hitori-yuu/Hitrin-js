const { EmbedBuilder, SlashCommandBuilder, codeBlock, PermissionFlagsBits } = require('discord.js');
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
		.setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

	async execute(interaction) {
		try {
            if (!interaction.guild.id === '876116489902653513') return CustomError(interaction, 'この機能は専用のサーバーでのみ使用できます。');
            const data = await agendas(interaction.guild);
            if (data.length <= 0) return CustomError(interaction, 'このサーバーでは議題がありません');
            const inquiryEmbed = new EmbedBuilder()
                .setColor('#93ca76')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            if (data.length <= 4) {
                data.forEach(data => {
                    inquiryEmbed
                        .addFields(
                            {
                                name: `__**議題名[${data.agenda}]:**__`,
                                value: `**[議題ID]** ${data.messageId}\n**[状態]** ${data.isClosed ? '終了済' : '進行中'}\n**[作成日時]** ${data.createdDate}\n**[獲得票]** 賛成:${data.agree} 反対:${data.oppose}`
                            },
                        )
                })
            } else if (data.length >= 5) {
                inquiryEmbed.setDescription('議題数が5以上のため終了済の議題は除外しています。')
                data.forEach(data => {
                    if (data.isClosed) return;
                    inquiryEmbed
                        .addFields(
                            {
                                name: `__**議題名[${data.agenda}]:**__`,
                                value: `**[議題ID]** ${data.messageId}\n**[状態]** ${data.isClosed ? '終了済' : '進行中'}\n**[作成日時]** ${data.createdDate}\n**[獲得票]** 賛成:${data.agree} 反対:${data.oppose}`
                            },
                        )
                })
            } else {
                return CustomError(interaction, 'この機能はまだ開発途中です。')
            };

            await interaction.followUp({
                embeds: [inquiryEmbed]
            });
		} catch (error) {
			return InteractionError(interaction, error);
		}
	},
};
