const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('length')
        .setNameLocalizations({
            'en-US': 'length',
            'ja': '文字数',
        })
        .setDescription('The letters that make up the input word are extracted one by one.')
        .setDescriptionLocalizations({
            'en-US': 'The letters that make up the input word are extracted one by one.',
            'ja': '入力した言葉を構成している文字を一文字ずつ取り出します。',
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
        const list = [...words];

        if (list.length > 300) return interaction.followUp({ content: '入力する文字は **300文字** までにしてください。' });

        interaction.followUp({
            content: `${list.length}個の文字が組み合わさっています。\n\`${list.join(', ')}\`` || 'None'
        });
	},
};
