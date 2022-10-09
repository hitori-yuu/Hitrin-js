const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');
const { default: axios } = require("axios");
const genshinDb = require('genshin-db');
genshinDb.setOptions({queryLanguages: ['Japanese'], resultLanguage: 'Japanese'})

module.exports = {
	data: new SlashCommandBuilder()
		.setName('genshin')
        .setNameLocalizations({
            'en-US': 'genshin',
            'ja': '原神',
        })
		.setDescription('Use the Genshin-DB to obtain various information.')
        .setDescriptionLocalizations({
            'en-US': 'Use the Genshin-DB to obtain various information.',
            'ja': 'Genshin-DB を使用して様々な情報を取得します。',
        })
		.setDMPermission(true)
		.addSubcommand(subcommand =>
			subcommand
				.setName('character')
				.setNameLocalizations({
					'en-US': 'character',
					'ja': 'キャラクター',
				})
				.setDescription('Displays information about that character.')
				.setDescriptionLocalizations({
					'en-US': 'Displays information about that character.',
					'ja': 'キャラクターの情報を表示。',
				})
				.addStringOption(
					option => option
					.setName('name')
					.setNameLocalizations({
						'en-US': 'name',
						'ja': '名前',
					})
					.setDescription('Enter the name of that character.')
					.setDescriptionLocalizations({
						'en-US': 'Enter the name of that character.',
						'ja': 'キャラクターの名前を入力。',
					})
					.setRequired(true)
				)
			)
        .addSubcommand(subcommand =>
            subcommand
                .setName('weapon')
                .setNameLocalizations({
                    'en-US': 'weapon',
                    'ja': '武器',
                })
                .setDescription('Displays information about that weapon.')
                .setDescriptionLocalizations({
                    'en-US': 'Displays information about that weapon.',
                    'ja': '武器の情報を表示。',
                })
                .addStringOption(
                    option => option
                    .setName('name')
                    .setNameLocalizations({
                        'en-US': 'name',
                        'ja': '名前',
                    })
                    .setDescription('Enter the name of that weapon.')
                    .setDescriptionLocalizations({
                        'en-US': 'Enter the name of that weapon.',
                        'ja': 'キャラクターの名前を入力。',
                    })
                    .setRequired(true)
                )
            ),

	async execute(interaction) {
		const name = interaction.options.getString('name');
        try {
            if (interaction.options.getSubcommand() === 'character') {
                const character = genshinDb.characters(name);
                const talents = genshinDb.talents(name);
                const characterEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setTitle(`${character.fullname} の詳細`)
                    .setThumbnail(character.images.icon)
                    .addFields(
                        {
                            name: '__**一般:**__',
                            value: `**[二つ名]** ${character.title}\n**[元素]** ${character.element}\n**[武器種類]** ${character.weapontype}`,
                            inline: true,
                        },
                        {
                            name: '__**詳細:**__',
                            value: `**[誕生日]** ${character.birthday}\n**[命ノ星座]** ${character.constellation}\n**[CV]** ${character.cv.japanese}`,
                            inline: true,
                        },
                        {
                            name: `__**元素爆発「${talents.combat3.name}」**__`,
                            value: talents.combat3.info
                        },
                        {
                            name: '__**パッシブスキル:**__',
                            value: `**[${talents.passive1.name}]** ${talents.passive1.info}\n**[${talents.passive2.name}]** ${talents.passive2.info}\n**[${talents.passive3.name}]** ${talents.passive3.info}`
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [characterEmbed]
                });
            } else if (interaction.options.getSubcommand() === 'weapon') {
                const weapon = genshinDb.weapons(name);
                const weaponEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setTitle(`${weapon.name} の詳細`)
                    .setThumbnail(weapon.images.icon)
                    .addFields(
                        {
                            name: '__**一般:**__',
                            value: `**[名前]** ${weapon.name}\n**[レア度]** ${weapon.rarity}\n**[武器種類]** ${weapon.weapontype}`
                        },
                        {
                            name: '__**説明:**__',
                            value: weapon.description,
                        },
                        {
                            name: '__**スキル:**__',
                            value: `**[${weapon.effectname}]**\n${weapon.effect}`
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [weaponEmbed]
                });
            }
        } catch (error) {
            const error_message = codeBlock('js', error.message);

            console.error('[エラー] コマンド実行中にエラーが発生しました。\n内容: ' + error.message);
            const errorEmbed = new EmbedBuilder()
                .setColor('#d9333f')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png'}), url: interaction.user.displayAvatarURL({ format: 'png'}) })
                .setDescription('コマンド実行時にエラーが発生しました。\n' + error_message)
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
            interaction.followUp({
                embeds: [errorEmbed]
            });
            return;
        }
	},
};

async function translate(content) {
    const character = await googleTs(content, { to: 'ja' });
    return character.text;
}