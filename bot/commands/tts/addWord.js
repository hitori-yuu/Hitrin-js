const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const wordsModel = require('../../models/wordsSchema');
const rpc = axios.create({ baseURL: "http://127.0.0.1:50021", proxy: false });

module.exports = {
	data: new SlashCommandBuilder()
        .setName('add-word')
        .setNameLocalizations({
            'en-US': 'add-word',
            'ja': '単語追加',
        })
        .setDescription('Add the entered word to the dictionary.')
        .setDescriptionLocalizations({
            'en-US': 'Add the entered word to the dictionary.',
            'ja': '入力した言葉を辞書に追加します。',
        })
		.setDMPermission(false)
        .addStringOption(
            option => option
            .setName('surface')
            .setNameLocalizations({
                'en-US': 'surface',
                'ja': '表層形',
            })
            .setDescription('Enter the surface form of the word.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the surface form of the word.',
                'ja': '言葉の表層形を入力。',
            })
            .setRequired(true)
        )
        .addStringOption(
            option => option
            .setName('pronunciation')
            .setNameLocalizations({
                'en-US': 'pronunciation',
                'ja': '発音',
            })
            .setDescription('Enter the pronunciation in katakana.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the pronunciation in katakana.',
                'ja': '発音をカタカナで入力。',
            })
            .setRequired(true)
        )
        .addNumberOption(
            option => option
            .setName('accent')
            .setNameLocalizations({
                'en-US': 'accent',
                'ja': 'アクセント',
            })
            .setDescription('Enter the location of the accent in number.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the location of the accent in number.',
                'ja': 'アクセントをつける位置を数字で入力。',
            })
            .setRequired(true)
        )
        .addStringOption(
            option => option
            .setName('type')
            .setNameLocalizations({
                'en-US': 'type',
                'ja': '種類',
            })
            .setDescription('Select the type of words.')
            .setDescriptionLocalizations({
                'en-US': 'Select the type of words.',
                'ja': '言葉の種類を選択。',
            })
            .addChoices(
				{ name: '固有名詞', value: 'PROPER_NOUN' },
				{ name: '普通名詞', value: 'COMMON_NOUN' },
                { name: '動詞', value: 'VERB' },
				{ name: '形容詞', value: 'ADJECTIVE' },
                { name: '語尾', value: 'SUFFIX' },
			)
        ),

	async execute(interaction) {
        const surface = interaction.options.getString('surface');
        const pronunciation = interaction.options.getString('pronunciation');
        const accent = interaction.options.getNumber('accent');
        const type = interaction.options.getString('type') || 'COMMON_NOUN';

        if (accent <= 0 || accent >= pronunciation.length) return interaction.followUp({ content: 'アクセントの場所が0以下または発音文字数を超えています。' });

        const wordsData = await wordsModel.find();
        const data = wordsData.filter(data => data.word  === surface);
        if (data.length > 0) return interaction.followUp({ content: 'その単語は既に追加されています' });

        const res = await rpc.post(`user_dict_word?surface=${encodeURI(surface)}&pronunciation=${encodeURI(pronunciation)}&accent_type=${encodeURI(accent)}&word_type=${encodeURI(type)}`);
        const wordEmbed = new EmbedBuilder()
            .setColor('#93ca76')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            .setDescription(`単語の追加に成功しました。\n**[表層形]** ${surface}\n**[発音]** ${pronunciation}\n**[アクセント]** ${accent.toString() || 'None'}\n**[種類]** ${type || 'None'}`)
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
        const wordData = await wordsModel.create({
            word: surface,
            word_id: res.data.toString(),
            date: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
        });

        wordData.save();
        interaction.followUp({
            embeds: [wordEmbed]
        });
	},
};
