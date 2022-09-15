const { InteractionType, EmbedBuilder, codeBlock } = require('discord.js');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
        try {
            const { client, player } = interaction;
            if (!interaction.isApplicationCommand()) return;
            const command = client.slashCommands.get(interaction.commandName);

            if (command) {
                await interaction.deferReply();
                await command.execute(interaction, player);
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
        }
	},
};
