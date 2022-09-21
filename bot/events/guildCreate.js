const { EmbedBuilder } = require('discord.js');
const guildsModel = require('../models/guildsSchema.js');

module.exports = {
	name: 'guildCreate',
	async execute(guild) {
        try {
            const owner = guild.client.users.cache.get(guild.ownerId);
            const author = guild.client.users.cache.get('874184214130602015');
            const thanks = new EmbedBuilder()
                .setColor('#ffdb4f')
                .setAuthor({ name: owner.tag, iconURL: owner.displayAvatarURL({ format: 'png' }) })
                .setTitle('導入ありがとうございます')
                .setThumbnail(guild.iconURL({extension: 'png', size: 128}))
                .addFields(
                    {
                        name: '__**作成者:**__',
                        value: `**[名前]** ${author.tag}\n**[ID]** ${author.id}\n**[メンション]** <@${author.id}>`
                    },
                    {
                        name: '__**ヘルプ:**__',
                        value: `バグや質問等ありましたら [ヒトリユウ](https://twitter.com/yuu_hitorin) にご連絡ください。`
                    },
                    {
                        name: '__**SNS:**__',
                        value: `**[Twitter]** [yuu_hitorin](https://twitter.com/yuu_hitorin)\n**[Discord]** [サーバー](https://discord.gg/7BDq9ZNfkf)`
                    },
                )
                .setTimestamp()
                .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

            const guildsData = await guildsModel.find();
            const data = guildsData.filter(data => data.id  === guild.id);
            if (data[0] == undefined) return;
            const guildData = await guildsModel.create({
                id: guild.id,
                name: guild.name,
                settings: {
                    autoMod: false,
                    autoPublish: true,
                    globalBan: true,
                    authRole: 'None',
                },
                createDate: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
            });

            const logEmbed = new EmbedBuilder()
                .setColor('#59b9c6')
                .setTitle("サーバー初期設定")
                .setThumbnail(guild.iconURL({extension: 'png', size: 128}))
                .setDescription(`サーバーの初期設定が完了しました。`)
                .addFields(
                    {
                        name: '__**サーバー:**__',
                        value: `**[名前]** ${guild.name}\n**[ID]** ${guild.id}`
                    },
                )

            guildData.save();
            guild.client.channels.cache.get('879943806118678528').send({
                embeds: [logEmbed]
            });

            await owner.send({ embeds: [thanks] });
        } catch (error) {
            console.error('[エラー] サーバー参加時にエラーが発生しました。\n内容: ' + error.message);
        }
	},
};
