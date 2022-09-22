const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const charactersModel = require('../../models/touhouCharactersSchema');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('touhou')
        .setNameLocalizations({
            'en-US': 'touhou',
            'ja': '東方辞典',
        })
        .setDescription('Commands related to the Touhou Project Dictionary in this bot\'s database.')
        .setDescriptionLocalizations({
            'en-US': 'Commands related to the Touhou Project Dictionary in this bot\'s database.',
            'ja': '本Botに搭載されている東方Project辞書に関するコマンドです。',
        })
		.setDMPermission(true)
        .addSubcommand(subcommand =>
			subcommand
				.setName('character')
				.setNameLocalizations({
					'en-US': 'character',
					'ja': 'キャラクター',
				})
				.setDescription('Display details of the specified character.')
				.setDescriptionLocalizations({
					'en-US': 'Display details of the specified character.',
					'ja': '指定したキャラクターの詳細を表示します。',
				})
				.addStringOption(
					option => option
					.setName('name')
					.setNameLocalizations({
						'en-US': 'name',
						'ja': '名前',
					})
					.setDescription('Enter character\'s name or alias.')
					.setDescriptionLocalizations({
						'en-US': 'Enter character\'s name or alias.',
						'ja': 'キャラクターの名前または別名を入力。',
					})
					.setRequired(true)
				)
			)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add-character')
                .setNameLocalizations({
                    'en-US': 'add-character',
                    'ja': 'キャラクター追加',
                })
                .setDescription('Add a new character.')
                .setDescriptionLocalizations({
                    'en-US': 'Add a new character.',
                    'ja': 'キャラクターを新規追加します。',
                })
                .addStringOption(
                    option => option
                    .setName('name')
                    .setNameLocalizations({
                        'en-US': 'name',
                        'ja': '名前',
                    })
                    .setDescription('Enter character\'s name.')
                    .setDescriptionLocalizations({
                        'en-US': 'EEnter character\'s name.',
                        'ja': 'キャラクターの名前を入力。',
                    })
                    .setRequired(true)
                )
                .addStringOption(
                    option => option
                    .setName('alias')
                    .setNameLocalizations({
                        'en-US': 'alias',
                        'ja': '別名',
                    })
                    .setDescription('Enter the character\'s alias. (If more than one, please insert a space.)')
                    .setDescriptionLocalizations({
                        'en-US': 'Enter the character\'s alias. (If more than one, please insert a space.)',
                        'ja': 'キャラクターの別名を入力。（複数の場合は空白を入れてください。）',
                    })
                )
                .addStringOption(
                    option => option
                    .setName('pronunciation')
                    .setNameLocalizations({
                        'en-US': 'pronunciation',
                        'ja': '読み名',
                    })
                    .setDescription('Enter the character\'s pronunciation.')
                    .setDescriptionLocalizations({
                        'en-US': 'Enter the character\'s pronunciation.',
                        'ja': 'キャラクターの読み名を入力。',
                    })
                )
                .addStringOption(
                    option => option
                    .setName('icon')
                    .setNameLocalizations({
                        'en-US': 'icon',
                        'ja': 'アイコン',
                    })
                    .setDescription('Enter the character\'s icon. (Only URL)')
                    .setDescriptionLocalizations({
                        'en-US': 'Enter the character\'s icon. (Only URL)',
                        'ja': 'キャラクターのアイコン画像を入力。（URLのみ）',
                    })
                )
                .addStringOption(
                    option => option
                    .setName('race')
                    .setNameLocalizations({
                        'en-US': 'race',
                        'ja': '種族',
                    })
                    .setDescription('Enter the character\'s race.')
                    .setDescriptionLocalizations({
                        'en-US': 'Enter the character\'s race.',
                        'ja': 'キャラクターの種族を入力。',
                    })
                )
                .addStringOption(
                    option => option
                    .setName('nickname')
                    .setNameLocalizations({
                        'en-US': 'nickname',
                        'ja': '二つ名',
                    })
                    .setDescription('Enter the character\'s nickname. (If more than one, please insert a space.)')
                    .setDescriptionLocalizations({
                        'en-US': 'Enter the character\'s nickname. (If more than one, please insert a space.)',
                        'ja': 'キャラクターの二つ名を入力。（複数の場合は空白を入れてください。）',
                    })
                )
                .addStringOption(
                    option => option
                    .setName('ability')
                    .setNameLocalizations({
                        'en-US': 'ability',
                        'ja': '能力',
                    })
                    .setDescription('Enter the character\'s ability.')
                    .setDescriptionLocalizations({
                        'en-US': 'Enter the character\'s ability.',
                        'ja': 'キャラクターの能力を入力。',
                    })
                )
                .addStringOption(
                    option => option
                    .setName('description')
                    .setNameLocalizations({
                        'en-US': 'description',
                        'ja': '説明',
                    })
                    .setDescription('Enter the character\'s description.')
                    .setDescriptionLocalizations({
                        'en-US': 'Enter the character\'s description.',
                        'ja': 'キャラクターの説明を入力。',
                    })
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit-character')
                .setNameLocalizations({
                    'en-US': 'edit-character',
                    'ja': 'キャラクター編集',
                })
                .setDescription('Edit a character.')
                .setDescriptionLocalizations({
                    'en-US': 'Edit a character.',
                    'ja': '追加済みのキャラクターを編集します。',
                })
                .addStringOption(
                    option => option
                    .setName('name')
                    .setNameLocalizations({
                        'en-US': 'name',
                        'ja': '名前',
                    })
                    .setDescription('Enter character\'s name.')
                    .setDescriptionLocalizations({
                        'en-US': 'EEnter character\'s name.',
                        'ja': 'キャラクターの名前を入力。',
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
                        { name: '名前', value: 'name' },
                        { name: '別名', value: 'alias' },
                        { name: '読み名', value: 'pronunciation' },
                        { name: 'アイコン', value: 'icon' },
                        { name: '種族', value: 'race' },
                        { name: '二つ名', value: 'nickname' },
                        { name: '能力', value: 'ability' },
                        { name: '説明', value: 'description' },
                    )
                    .setRequired(true)
                )
                .addStringOption(
                    option => option
                    .setName('content')
                    .setNameLocalizations({
                        'en-US': 'content',
                        'ja': '内容',
                    })
                    .setDescription('Enter the changes.')
                    .setDescriptionLocalizations({
                        'en-US': 'Enter the changes.',
                        'ja': '変更内容を入力。',
                    })
                    .setRequired(true)
                )
            ),

	async execute(interaction) {
        const name = interaction.options.getString('name');
        var alias = interaction.options.getString('alias');
        const pronunciation = interaction.options.getString('pronunciation');
        const icon = interaction.options.getString('icon');
        const race = interaction.options.getString('race');
        var nickname = interaction.options.getString('nickname');
        const ability = interaction.options.getString('ability');
        const description = interaction.options.getString('description');
        const type = interaction.options.getString('type');
        const content = interaction.options.getString('content');

        try {
            if (interaction.options.getSubcommand() === 'character') {
                const charactersData = await charactersModel.find();
                const data = charactersData.filter(data => (data.alias.includes(name)) || (data.name === name));
                if (data[0] == undefined) return interaction.followUp({ content: 'そのキャラクターは登録されていません。' });
                var nicks = [];
                if (data[0].nickname) {
                    for (var i = 0; i < 5; i++) {
                        if (!data[0].nickname[i]) break;
                        nicks.push(data[0].nickname[i]);
                    }
                }

                const characterEmbed = new EmbedBuilder()
                    .setColor('#59b9c6')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setTitle(data[0].name)
                    .setImage(data[0].icon, data[0].icon)
                    .addFields(
                        {
                            name: '__**読み名:**__',
                            value: data[0].pronunciation || '登録無し',
                            inline: true
                        },
                        {
                            name: '__**種族:**__',
                            value: data[0].race || '登録無し',
                            inline: true
                        },
                        {
                            name: '__**二つ名:**__',
                            value: nicks.join(', ') || '登録無し'
                        },
                        {
                            name: '__**能力:**__',
                            value: data[0].ability || '登録無し'
                        },
                        {
                            name: '__**説明:**__',
                            value: data[0].description || '登録無し'
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [characterEmbed]
                });
            } else if (interaction.options.getSubcommand() === 'add-character') {
                const charactersData = await charactersModel.find();
                const data = charactersData.filter(data => (data.alias.includes(name)) || (data.name === name));
                if (data[0]) return interaction.followUp({ content: 'そのキャラクターは既に登録されています。' });

                var aliases = [];
                var nicks = [];

                if (alias) {
                    alias = alias.split(' ');
                    for (let i = 0; i < alias.length; i++) {
                        aliases.push(alias[i]);
                    }
                }
                if (nickname) {
                    nickname = nickname.split(' ');
                    for (let i = 0; i < nickname.length; i++) {
                        nicks.push(nickname[i]);
                    }
                }


                const characterEmbed = new EmbedBuilder()
                    .setColor('#93ca76')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setImage(icon, icon)
                    .setDescription(`キャラクターの追加に成功しました: **${name}**`)
                    .addFields(
                        {
                            name: '__**読み名:**__',
                            value: pronunciation || '登録無し',
                            inline: true,
                        },
                        {
                            name: '__**種族:**__',
                            value: race || '登録無し',
                            inline: true,
                        },
                        {
                            name: '__**アイコン:**__',
                            value: `[URL](${icon})` || '登録無し',
                            inline: true,
                        },
                        {
                            name: '__**別名:**__',
                            value: aliases.slice(0, 5).join(', ') || '登録無し',
                        },
                        {
                            name: '__**二つ名:**__',
                            value: nicks.slice(0, 5).join(', ') || '登録無し',
                        },
                        {
                            name: '__**能力:**__',
                            value: ability || '登録無し'
                        },
                        {
                            name: '__**説明:**__',
                            value: description || '登録無し'
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                const characterData = await charactersModel.create({
                    name: name,
                    alias: aliases || null,
                    pronunciation: pronunciation || null,
                    icon: icon || null,
                    race: race || null,
                    nickname: nicks || null,
                    ability: ability || null,
                    description: description || null,
                    author: {
                        name: interaction.user.username,
                        id:  interaction.user.id,
                    },
                    updatedDate : new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                });

                characterData.save();
                interaction.followUp({
                    embeds: [characterEmbed]
                });
            } else if (interaction.options.getSubcommand() === 'edit-character') {
                const charactersData = await charactersModel.find();
                const data = charactersData.filter(data => data.name === name);
                if (data[0] == undefined) return interaction.followUp({ content: 'そのキャラクターは登録されていません。' });

                var aliases = [];
                var nicks = [];
                var typeKey;
                var typeValue;
                var typeName;

                typeValue = content;
                if (type === 'alias') {
                    alias = content.split(' ');
                    for (let i = 0; i < alias.length; i++) {
                        aliases.push(alias[i]);
                    }
                    typeValue = aliases;
                }
                if (type === 'nickname') {
                    nickname = content.split(' ');
                    for (let i = 0; i < nickname.length; i++) {
                        nicks.push(nickname[i]);
                    }
                    typeValue = nicks;
                }

                switch (type) {
                    case 'name':
                        typeName = '名前'
                        const nameData = await charactersModel.findOneAndUpdate(
                            {
                                name: name,
                            },
                            {
                                $set: {
                                    name: typeValue,
                                    updatedDate : new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                                },
                            },
                        );
                        characterData.save();
                        break;
                    case 'alias':
                        typeName = '別名';
                        const aliasData = await charactersModel.findOneAndUpdate(
                            {
                                name: name,
                            },
                            {
                                $set: {
                                    alias: typeValue,
                                    updatedDate : new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                                },
                            },
                        );
                        aliasData.save();
                        break;
                    case 'pronunciation':
                        typeName = '読み名';
                        const pronunciationData = await charactersModel.findOneAndUpdate(
                            {
                                name: name,
                            },
                            {
                                $set: {
                                    pronunciation: typeValue,
                                    updatedDate : new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                                },
                            },
                        );
                        pronunciationData.save();
                        break;
                    case 'icon':
                        typeName = 'アイコン';
                        const iconData = await charactersModel.findOneAndUpdate(
                            {
                                name: name,
                            },
                            {
                                $set: {
                                    icon: typeValue,
                                    updatedDate : new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                                },
                            },
                        );
                        iconData.save();
                        break;
                    case 'race':
                        typeName = '種族';
                        const raceData = await charactersModel.findOneAndUpdate(
                            {
                                name: name,
                            },
                            {
                                $set: {
                                    race: typeValue,
                                    updatedDate : new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                                },
                            },
                        );
                        raceData.save();
                        break;
                    case 'nickname':
                        typeName = '二つ名';
                        const nicknameData = await charactersModel.findOneAndUpdate(
                            {
                                name: name,
                            },
                            {
                                $set: {
                                    nickname: typeValue,
                                    updatedDate : new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                                },
                            },
                        );
                        characterData.save();
                        break;
                    case 'ability':
                        typeName = '能力';
                        const abilityData = await charactersModel.findOneAndUpdate(
                            {
                                name: name,
                            },
                            {
                                $set: {
                                    ability: typeValue,
                                    updatedDate : new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                                },
                            },
                        );
                        abilityData.save();
                        break;
                    case 'description':
                        typeName = '説明';
                        const descriptionData = await charactersModel.findOneAndUpdate(
                            {
                                name: name,
                            },
                            {
                                $set: {
                                    description: typeValue,
                                    updatedDate : new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
                                },
                            },
                        );
                        descriptionData.save();
                        break;
                }

                const characterEmbed = new EmbedBuilder()
                    .setColor('#93ca76')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
                    .setThumbnail(icon)
                    .setDescription(`キャラクターの編集に成功しました: **${name}**`)
                    .addFields(
                        {
                            name: `__**${typeName}:**__`,
                            value: content,
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

                interaction.followUp({
                    embeds: [characterEmbed]
                });
            }
        } catch (error) {
            console.log(error);
        }
	},
};
