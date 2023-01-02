const { Collection, ChannelType, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../functions/embeds');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');
const config = require('../config.json');

module.exports = {
	name: 'interactionCreate',

	async execute(interaction) {
		const { client } = interaction;

		if (!interaction.isChatInputCommand()) return;

		const command = client.slashCommands.get(interaction.commandName);

		if (!command) return;

		if (!await isCreatedUser(interaction.user)) await createUserData(interaction.user);
		if (interaction.channel.type == ChannelType.GuildText) {
			if (!await isCreatedGuild(interaction.guild)) await createGuildData(interaction.guild);
		};
		if (await isCreatedUser(interaction.user)) {
			if (!await isAvailableUser(interaction.user)) return TOS(interaction);
		};

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
            await interaction.reply({
                embeds: [ErrorEmbed(error)]
            });
			return;
		};
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
        .setDescription('‣ [利用規約](https://hitori-yuu.github.io/Hitrin-web/terms.html)\n\n‣ [プライバシーポリシー](https://hitori-yuu.github.io/Hitrin-web/privacy.html)\n\n確認した後、以下のいずれかのボタンをクリックしてください。')

    await interaction.reply({
        embeds: [tosEmbed],
        components: [row],
        ephemeral: true
    });
};