const { SlashCommandBuilder } = require('discord.js');
const usersModel = require('../../models/usersSchema');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('select-speaker')
        .setNameLocalizations({
            'en-US': 'select-speaker',
            'ja': '音声選択',
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
				{ name: '九州そら(ノーマル)', value: 16 },
                { name: '九州そら(あまあま)', value: 15 },
                { name: '九州そら(セクシー)', value: 17 },
			)
            .setRequired(true)
        ),

	async execute(interaction) {
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

        var speakerName = 'ずんだもん(セクシー)';
        if (speaker === 2) {
            speakerName = '四国めたん(ノーマル)';
        } else if (speaker === 0) {
            speakerName = '四国めたん(あまあま)';
        } else if (speaker === 3) {
            speakerName = 'ずんだもん(ノーマル)';
        } else if (speaker === 1) {
            speakerName = 'ずんだもん(あまあま)';
        } else if (speaker === 5) {
            speakerName = 'ずんだもん(セクシー)';
        } else if (speaker === 8) {
            speakerName = '春日部つむぎ';
        } else if (speaker === 10) {
            speakerName = '雨晴はう';
        } else if (speaker === 16) {
            speakerName = '九州そら(ノーマル)';
        } else if (speaker === 15) {
            speakerName = '九州そら(あまあま)';
        } else if (speaker === 17) {
            speakerName = '九州そら(セクシー)';
        }

        userData.save();
        interaction.followUp({
            content: `音声読み上げを \`${speakerName}\` に設定しました。`
        });
	},
};
