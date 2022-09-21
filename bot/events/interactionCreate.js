const { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType, EmbedBuilder, codeBlock } = require('discord.js');
const usersModel = require('../models/usersSchema');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
        try {
            const { client, player } = interaction;
            if (!interaction.type == InteractionType.ApplicationCommand) return;
            const command = client.slashCommands.get(interaction.commandName);

            if (command) {
                const usersData = await usersModel.find();
                const data = usersData.filter(data => data.id  === interaction.user.id);

                if (data.length <= 0) return;
                await interaction.deferReply();

                if (data[0].tos) {
                    await command.execute(interaction, player);
                } else if (!data[0].tos) {
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('consent')
                                .setLabel('同意')
                                .setStyle(ButtonStyle.Success),
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('oppose')
                                .setLabel('反対')
                                .setStyle(ButtonStyle.Danger),
                        );
                    const tosEmbed = new EmbedBuilder()
                        .setColor('#59b9c6')
                        .setAuthor({ name: 'ボットの利用には、利用規約・プライバシーポリシーへの同意が必要です。' })
                        .setDescription('‣ [利用規約](https://hitori-yuu.github.io/Hitrin-web/terms.html)\n\n‣ [プライバシーポリシー](https://hitori-yuu.github.io/Hitrin-web/privacy.html)\n\n必ず確認してから、以下のいずれかのボタンをクリックしてください。')

                    interaction.followUp({
                        embeds: [tosEmbed],
                        components: [row],
                        ephemeral: true
                    });
                }
            }
        } catch (error) {
            console.error('[エラー] コマンド実行時にエラーが発生しました。\n内容: ' + error.message);
            const error_message = codeBlock('js', error.message);

            const errorEmbed = new EmbedBuilder()
                .setColor('#d9333f')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png'}), url: interaction.user.displayAvatarURL({ format: 'png'}) })
                .setDescription('コマンド実行時にエラーが発生しました。\n' + error_message)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
            interaction.followUp({
                embeds: [errorEmbed]
            });
            return;
        }
	},
};
