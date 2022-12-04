const { SlashCommandBuilder } = require('discord.js');
const segmenter = new Intl.Segmenter("ja", {granularity: "grapheme"});
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');

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
        try {
            const words = segmenter.segment(interaction.options.getString('words'));
            const list = [...words];
            var wordsList = [];

            for (let i = 0; i < list.length; i++) {
                wordsList.push(list[i].segment)
            };

            if (list.length > 300) return await interaction.followUp({ content: '入力する文字は **300文字** までにしてください。' });

            await interaction.followUp({
                content: `${list.length}個の文字が組み合わさっています。\n\`${wordsList.join(', ')}\`` || 'None'
            });
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
