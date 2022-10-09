const { Error } = require('../handlers/error');
const { isAvailableUser, isCreatedUser, isCreatedGuild } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');

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

            if (await isCreatedGuild(interaction.guild) == 'false') await createGuildData(guild);

            await owner.send({ embeds: [thanks] });
        } catch (error) {
			return Error(error);
        }
	},
};
