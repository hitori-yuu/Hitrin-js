const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('reverse')
        .setNameLocalizations({
            'en-US': 'reverse',
            'ja': 'さかさま',
        })
        .setDescription('Return the input word reverse.')
        .setDescriptionLocalizations({
            'en-US': 'Return the input word reverse.',
            'ja': '入力した言葉を逆さまにして返します。',
        })
        .setDMPermission(true)
        .addStringOption(
            option => option
            .setName('words')
            .setNameLocalizations({
                'en-US': 'words',
                'ja': '言葉',
            })
            .setDescription('Enter the words.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the words.',
                'ja': '言葉を入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
        const words = interaction.options.getString('words');
        const list = words.split('');
        const reserved = list.reverse();

        interaction.followUp({
            content: reserved.join('') || 'None'
        });
	},
};
