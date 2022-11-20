const { SlashCommandBuilder } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../../handlers/error');
const usersModel = require('../../models/usersSchema');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('tts-speaker')
        .setNameLocalizations({
            'en-US': 'tts-speaker',
            'ja': '読み上げ音声',
        })
        .setDescription('Sets the voice to Text-to-Speech.')
        .setDescriptionLocalizations({
            'en-US': 'Sets the voice to Text-to-Speech.',
            'ja': '読み上げる音声を設定します。',
        })
		.setDMPermission(false)
        .addNumberOption(
            option => option
            .setName('speaker')
            .setNameLocalizations({
                'en-US': 'speaker',
                'ja': 'スピーカー',
            })
            .setDescription('Select a voice to Text-to-Speech.')
            .setDescriptionLocalizations({
                'en-US': 'Select a voice to Text-to-Speech.',
                'ja': '読み上げる音声を選択。',
            })
            .addChoices(
				{ name: '四国めたん(ノーマル)', value: 2 },
                { name: '四国めたん(あまあま)', value: 0 },
                { name: 'ずんだもん(ノーマル)', value: 3 },
                { name: 'ずんだもん(あまあま)', value: 1 },
                { name: 'ずんだもん(セクシー)', value: 5 },
				{ name: '春日部つむぎ', value: 8 },
                { name: '雨晴はう', value: 10 },
                { name: '白上虎太郎', value: 12 },
                { name: '青山龍星', value: 13 },
                { name: '剣崎雌雄', value: 21 },
			)
            .setRequired(true)
        ),

	async execute(interaction) {
        try {
            const speaker = interaction.options.getNumber('speaker');
            const userData = await usersModel.findOneAndUpdate(
                {
                    id: interaction.user.id,
                },
                {
                    $set: {
                        speaker: speaker,
                    },
                },
            );
            const speakerName = {
                2: '四国めたん(ノーマル)',
                0: '四国めたん(あまあま)',
                3: 'ずんだもん(ノーマル)',
                1: 'ずんだもん(あまあま)',
                5: 'ずんだもん(セクシー)',
                8: '春日部つむぎ',
                10: '雨晴はう',
                12: '白上虎太郎',
                13: '青山龍星',
                21: '剣崎雌雄',
            };

            await userData.save();
            await interaction.followUp({
                content: `音声読み上げを \`${speakerName[speaker]}\` に設定しました。`
            });
        } catch (error) {
			return InteractionError(error, interaction);
        }
	},
};
