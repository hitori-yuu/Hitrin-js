const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require('discord.js');
const profileModel = require('../models/profileSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
        if (interaction.user.bot) return;
        if (!interaction.isButton()) return;

        const profileData = await profileModel.findOne({ _id: interaction.user.id });
        if (!profileData) return;
        let Birthday = '非公開';
        if (profileData.birthday.public == true) Birthday = formatDate(profileData.birthday.date, 'yyyy/M/d');
        function formatDate (date, format) {
            format = format.replace(/yyyy/g, date.getFullYear());
            format = format.replace(/M/g, (date.getMonth() + 1));
            format = format.replace(/d/g, (date.getDate()));
            return format;
          };

        const setting = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('プロフィール > 設定')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription('設定したい項目を以下から選び、設定してください。')
            .addFields(
                { name: '__**名前:**__', value: 'プロフィールに載せる名前を設定します。' },
                { name: '__**アバター:**__', value: 'プロフィールに載せるアバターを設定します。' },
                { name: '__**カラー:**__', value: 'プロフィールに載せる色を設定します。' },
                { name: '__**誕生日:**__', value: 'プロフィールに載せる誕生日を設定します。' },
                { name: '__**紹介文:**__', value: 'プロフィールに載せる紹介文を設定します。' },
            )
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        const setting_name = new MessageButton()
			.setCustomId('setting_name')
			.setStyle('PRIMARY')
			.setLabel('名前');
        const setting_avatar = new MessageButton()
			.setCustomId('setting_avatar')
			.setStyle('PRIMARY')
			.setLabel('アバター');
        const setting_color = new MessageButton()
			.setCustomId('setting_color')
			.setStyle('PRIMARY')
			.setLabel('カラー');
        const setting_birthday = new MessageButton()
			.setCustomId('setting_birthday')
			.setStyle('PRIMARY')
			.setLabel('誕生日');
        const setting_birthday_release = new MessageButton()
			.setCustomId('setting_birthday_release')
			.setStyle('SUCCESS')
			.setLabel('公開');
        const setting_birthday_private = new MessageButton()
			.setCustomId('setting_birthday_private')
			.setStyle('DANGER')
			.setLabel('非公開');
        const setting_description = new MessageButton()
			.setCustomId('setting_description')
			.setStyle('PRIMARY')
			.setLabel('紹介文');
        const setting_name_2 = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('プロフィール > 設定 > 名前')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription('__15秒以内__に、プロフィールに載せたい任意の**名前**を入力してください。')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        const setting_avatar_2 = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('プロフィール > 設定 > アバター')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription('__15秒以内__に、プロフィールに載せたい任意の**アバターのURL**を入力または**画像を添付**してください。\n`default` と入力するとDiscordのアイコンを設定します。')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        const setting_color_2 = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('プロフィール > 設定 > カラー')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription('__15秒以内__に、プロフィールの**色を__16進数__カラーコードで**入力してください。\n「[HTMLカラーコード: WEB色見本 原色大辞典](https://www.colordic.org/)」こちらのサイトを参考に。\n`default` と入力すると黒色(#000000)を設定します。')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        const setting_birthday_2 = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('プロフィール > 設定 > 誕生日')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription('誕生日を公開しますか？以下のボタンをクリックしてください。')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        const setting_birthday_3 = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('プロフィール > 設定 > 誕生日')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription('__20秒以内__に、プロフィールに載せたい任意の**誕生日**を入力してください。\n例: ド〇えもんの誕生日「2112年9月3日」なら ⇒ `2112/09/03`')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        const setting_description_2 = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('プロフィール > 設定 > 紹介文')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription('__60秒以内__に、プロフィールに載せたい任意の**紹介文**を入力してください。')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        const status = new MessageEmbed()
            .setColor(profileData.color)
            .setTitle('あなたのプロフィール')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription(`**__一般:__**\n **[ID]** ${profileData.id}\n **[名前]** ${profileData.name}\n **[誕生日]** ${Birthday}\n\n${profileData.description}`)
            .setThumbnail(profileData.avatar)
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        const search = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('プロフィール > 検索')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription('__10秒以内__に、閲覧したいプロフィールのユーザーIDを入力してください。')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        if (interaction.user.bot) return;
        if (interaction.customId === 'profile_setting') {
            await interaction.reply({
                embeds: [setting],
                components: [new MessageActionRow().addComponents([setting_name, setting_avatar, setting_color, setting_birthday, setting_description])],
            });
        }
        if (interaction.customId === 'setting_name') {
            await interaction.reply({
                embeds: [setting_name_2],
            });
            const filter = msg => msg.author.id === interaction.user.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 30000 })
                .then(async collected => {
                    if (!collected.size) return interaction.reply('タイムアウト');
                    else if (collected) {
                        var arg = collected.first().content
                        const profile = await profileModel.findOneAndUpdate(
                            {
                                _id: interaction.user.id,
                            },
                            {
                                $set: {
                                    name: arg,
                                },
                            },
                        );
                        profile.save();
                        interaction.channel.send(`設定完了: 表示する名前を「 ${arg} 」に変更しました。`, { ephemeral: true });
                    }
                });
        }
        if (interaction.customId === 'setting_avatar') {
            await interaction.reply({
                embeds: [setting_avatar_2],
            });
            const filter = msg => msg.author.id === interaction.user.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 30000 })
                .then(async collected => {
                    if (!collected.size) return interaction.reply('タイムアウト');
                    else if (collected) {
                        var arg = collected.first().content || collected.first().attachments.first().url
                        if (arg === 'default') arg = interaction.user.displayAvatarURL({ format: 'png' })
                        const profile = await profileModel.findOneAndUpdate(
                            {
                                _id: interaction.user.id,
                            },
                            {
                                $set: {
                                    avatar: arg,
                                },
                            },
                        );
                        profile.save();
                        interaction.channel.send(`設定完了: 表示するアバターを「 ${arg} 」に変更しました。`, { ephemeral: true });
                    }
            });
        }
        if (interaction.customId === 'setting_color') {
            await interaction.reply({
                embeds: [setting_color_2],
            });
            const filter = msg => msg.author.id === interaction.user.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 30000 })
                .then(async collected => {
                    if (!collected.size) return interaction.reply('タイムアウト');
                    else if (collected) {
                        var arg = collected.first().content
                        if (arg == 'default') arg = '#000000';
                        var reg=/^#([0-9a-f]{3}){1,2}$/i;
                        if (reg.test(arg)) {
                            const profile = await profileModel.findOneAndUpdate(
                                {
                                    _id: interaction.user.id,
                                },
                                {
                                    $set: {
                                        color: arg,
                                    },
                                },
                            );
                            profile.save();
                            interaction.channel.send(`設定完了: 表示するカラーを「 ${arg} 」に変更しました。`, { ephemeral: true });
                        } else {
                            return error_invalid(interaction, client, 'カラーコード');
                        }
                    }
                });
        }
        if (interaction.customId === 'setting_birthday') {
            await interaction.reply({
                embeds: [setting_birthday_2],
                components: [new MessageActionRow().addComponents([setting_birthday_release, setting_birthday_private])],
            });
        }
        if (interaction.customId === 'setting_birthday_release') {
            await interaction.reply({
                embeds: [setting_birthday_3],
            });
            const filter = msg => msg.author.id === interaction.user.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 60000 })
                .then(async collected => {
                    if (!collected.size) return interaction.reply('タイムアウト');
                    else if (collected) {
                        var date = Date.parse(collected.first().content);
                        const profile = await profileModel.findOneAndUpdate(
                            {
                                _id: interaction.user.id,
                            },
                            {
                                $set: {
                                    birthday: {
                                        date: date,
                                        public: true
                                    }
                                },
                            },
                        );
                        profile.save();
                        interaction.channel.send(`設定完了: 誕生日を**公開**、「 ${formatDate(date, 'yyyy/M/d')} 」に変更しました。`, { ephemeral: true });
                    }
                });
        }
        if (interaction.customId === 'setting_birthday_private') {
            const profile = await profileModel.findOneAndUpdate(
                {
                    _id: interaction.user.id,
                },
                {
                    $set: {
                        birthday: {
                            public: false
                        }
                    },
                },
            );
            profile.save();
            await interaction.channel.send(`設定完了: 誕生日を**非公開**に変更しました。`, { ephemeral: true });
        }
        if (interaction.customId === 'setting_description') {
            await interaction.reply({
                embeds: [setting_description_2],
            });
            const filter = msg => msg.author.id === interaction.user.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 30000 })
                .then(async collected => {
                    if (!collected.size) return interaction.reply('タイムアウト');
                    else if (collected) {
                        const profile = await profileModel.findOneAndUpdate(
                            {
                                _id: interaction.user.id,
                            },
                            {
                                $set: {
                                    description: collected.first().content
                                },
                            },
                        );
                        profile.save();
                        interaction.channel.send(`設定完了: 紹介文を\n${collected.first().content}\nに設定しました`, { ephemeral: true });
                    }
                });
        }
        else if (interaction.customId === 'profile_status') {
            await interaction.reply({
                embeds: [status],
            });
        }
        else if (interaction.customId === 'profile_search') {
            await interaction.reply({
                embeds: [search],
            });
            const filter = msg => msg.author.id === interaction.user.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 30000 })
                .then(async collected => {
                    if (!collected.size) {return interaction.reply('タイムアウト');}
                    else if (collected) {
                        const target = client.users.cache.get(collected.first().content)
                        const profile = await profileModel.findOne({ _id: target.id });
                        if (!profile) return interaction.reply('そのユーザーのプロフィールは見つかりませんでした。')
                        const embed = new MessageEmbed()
                            .setColor(profile.color)
                            .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL({ format: 'png' }), url: target.displayAvatarURL({ format: 'png' }) })
                            .setDescription(`**__一般:__**\n **[ID]** ${profile._id}\n **[名前]** ${profile.name}\n **[誕生日]** ${Birthday}\n\n${profile.description}`)
                            .setThumbnail(profile.avatar)
                            .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
                            .setTimestamp();
                        interaction.channel.send({ embeds: [embed]});
                    }
                });
        }
	},
};

function error_invalid(interaction, client, invalid) {
	const error = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription(`実行に必須なパラメータが無効です: \`${invalid || 'None'}\``)
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	return interaction.channel.send({ embeds: [error] });
}

/*
const filter = msg => msg.author.id === interaction.user.id;
interaction.channel.awaitMessages({ filter, max: 1, time: 10000 })
    .then(collected => {
        if (!collected.size) return interaction.reply('タイムアウト');
        else if (collected.first().content === '-reset') {
            interaction.reply('設定完了: ニックネームをリセットしました。');
            interaction.guild.me.setNickname('');
        }
        else {
            interaction.reply('設定完了: **' + collected.first().content + '** に変更しました。');
            interaction.guild.me.setNickname(collected.first().content);
        }
});
*/
