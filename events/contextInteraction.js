const { EmbedBuilder, codeBlock } = require('discord.js');

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		const { client } = interaction;

		if (!interaction.isContextMenuCommand()) return;

		if (interaction.isUserContextMenuCommand()) {
			const command = client.contextCommands.get(
				"USER " + interaction.commandName
			);


			try {
                await interaction.deferReply();
				await command.execute(interaction);
				return;
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
		}
		else if (interaction.isMessageContextMenuCommand()) {
			const command = client.contextCommands.get(
				"MESSAGE " + interaction.commandName
			);

			try {
				await command.execute(interaction);
				return;
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
		}
	},
};