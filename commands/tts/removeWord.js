const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const wordsModel = require('../../models/wordsSchema');
const rpc = axios.create({ baseURL: "http://127.0.0.1:50021", proxy: false });

module.exports = {
	data: new SlashCommandBuilder()
        .setName('remove-word')
        .setNameLocalizations({
            'en-US': 'remove-word',
            'ja': '単語削除',
        })
        .setDescription('Delete the entered word from the dictionary.')
        .setDescriptionLocalizations({
            'en-US': 'Delete the entered word from the dictionary.',
            'ja': '入力した言葉を辞書から削除します。',
        })
		.setDMPermission(false)
        .addStringOption(
            option => option
            .setName('surface')
            .setNameLocalizations({
                'en-US': 'surface',
                'ja': '表層形',
            })
            .setDescription('Select the type of execution.')
            .setDescriptionLocalizations({
                'en-US': 'Select the type of execution.',
                'ja': '削除する言葉を入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction) {
        const surface = interaction.options.getString('surface');

        const wordsData = await wordsModel.find();
        const word = wordsData.filter(data => data.word === surface);
        if (word.length <= 0) return interaction.followUp({ content: 'その単語は登録されていません。' });

        await rpc.delete(`user_dict_word/${word[0].word_id}`);
        const wordEmbed = new EmbedBuilder()
            .setColor('#93ca76')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            .setDescription(`単語の削除に成功しました: \`${surface}\``)
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        interaction.followUp({
            embeds: [wordEmbed]
        });
        await wordsModel.deleteOne({ word: surface });
	},
};
