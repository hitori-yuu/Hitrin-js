const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require('discord.js');
const profileModel = require('../models/profileSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
        const profileData = await profileModel.findOne({ _id: interaction.user.id });
        if (!profileData) return;
        let birthday = '非公開';
        if (profileData.birthday.public === true) birthday = profileData.birthday;

        const setting = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('プロフィール > 設定')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription('設定したい項目を以下から選び、設定してください。')
            .addFields(
                { name: '__**名前:**__', value: 'プロフィールに載せる名前を設定します。' },
                { name: '__**アバター:**__', value: 'プロフィールに載せるアバターを設定します。' },
                { name: '__**色:**__', value: 'プロフィールに載せる色を設定します。' },
                { name: '__**誕生日:**__', value: 'プロフィールに載せる誕生日を設定します。' },
                { name: '__**紹介文:**__', value: 'プロフィールに載せる紹介文を設定します。' },
            )
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
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
			.setLabel('色');
        const setting_birthday = new MessageButton()
			.setCustomId('setting_birthday')
			.setStyle('PRIMARY')
			.setLabel('誕生日');
        const setting_description = new MessageButton()
			.setCustomId('setting_description')
			.setStyle('PRIMARY')
			.setLabel('紹介文');
        const status = new MessageEmbed()
            .setColor(profileData.color)
            .setTitle('あなたのプロフィール')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription(`**__一般:__**\n **[ID]** ${profileData.id}\n **[名前]** ${profileData.name}\n **[誕生日]** ${birthday}\n\n${profileData.description}`)
            .setThumbnail(profileData.avatar)
            .setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        const search = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('プロフィール > 検索')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription('__10秒以内__に、閲覧したいプロフィールのユーザータグまたはユーザーIDを入力してください。')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();
        if (interaction.user.bot) return;
        if (interaction.customId === 'profile_setting') {
            await interaction.reply({
                embeds: [setting],
                components: [new MessageActionRow().addComponents([setting_name, setting_avatar, setting_color, setting_birthday, setting_description])],
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
            interaction.channel.awaitMessages({ filter, max: 1, time: 10000 })
                .then(collected => {
                    if (!collected.size) {return interaction.channel.send('タイムアウト');}
                    else if (collected) {
                        const target = client.users.cache.find((user) => user.user.tag === collected.first().content) || client.users.cache.get(collected.first().content)
                        const Profile = profileModel.findOne({ _id: target.user.id });
                        if (Profile) return interaction.reply('そのユーザーのプロフィールは見つかりませんでした。')
                        let birth = '非公開';
                        if (Profile.birthday.public === true) birth = Profile.birthday;
                        const embed = new MessageEmbed()
                            .setColor(Profile.color)
                            .setAuthor({ name: target.user.tag, iconURL: target.user.displayAvatarURL({ format: 'png' }), url: target.user.displayAvatarURL({ format: 'png' }) })
                            .setDescription(`**__一般:__**\n **[ID]** ${Profile.id}\n **[名前]** ${Profile.name}\n **[誕生日]** ${birth}\n\n${Profile.description}`)
                            .setThumbnail(Profile.avatar)
                            .setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
                            .setTimestamp();
                        interaction.channel.send({ embeds: [embed]});
                    }
                });
        }
	},
};

/*
const filter = msg => msg.author.id === interaction.user.id;
interaction.channel.awaitMessages({ filter, max: 1, time: 10000 })
    .then(collected => {
        if (!collected.size) {return interaction.channel.send('タイムアウト');}
        else if (collected.first().content === '-reset') {
            interaction.channel.send('設定完了: ニックネームをリセットしました。');
            interaction.guild.me.setNickname('');
        }
        else {
            interaction.channel.send('設定完了: **' + collected.first().content + '** に変更しました。');
            interaction.guild.me.setNickname(collected.first().content);
        }
});
*/