const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { wordsData } = require('../../functions/MongoDB');
const Model = require(`../../models/wordsSchema`);
const { CustomError } = require('../../handlers/error');
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
        try {
            const surface = interaction.options.getString('surface');
            const words = await wordsData(surface);
            if (words.length <= 0) return CustomError(interaction, 'その単語は登録されていません。');

            await rpc.delete(`user_dict_word/${words[0].word_id}`);
            await Model.findOneAndDelete({ word_id: words[0].word_id });
            const wordEmbed = new EmbedBuilder()
                .setColor('#93ca76')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                .setDescription(`単語の削除に成功しました: \`${surface}\``)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            await interaction.followUp({
                embeds: [wordEmbed]
            });
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
