const { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType, EmbedBuilder } = require('discord.js');
const { InteractionError } = require('../handlers/error');
const { isAvailable } = require('../functions/isAvailable');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
        try {
            const { client } = interaction;
            if (!interaction.type == InteractionType.ApplicationCommand) return;
            const command = client.slashCommands.get(interaction.commandName);

            if (command) {
                await interaction.deferReply();

                if (!isAvailable(interaction)) return TOS(interaction);

                await command.execute(interaction);
            }
        } catch (error) {
			return InteractionError(error, interaction);
        }
	},
};

async function TOS(interaction) {
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
};