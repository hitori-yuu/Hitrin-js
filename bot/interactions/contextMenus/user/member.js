const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: {
		name: 'メンバーの詳細',
		type: 2,
	},

	async execute(interaction) {
        const member = interaction.guild.members.cache.get(interaction.targetId);

        const memberEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
            .setTitle(`${member.displayName} の詳細`)
            .setThumbnail(member.displayAvatarURL({ extension: 'png' }))
            .addFields(
                {
                    name: '__**一般:**__',
                    value: `**[名前]** ${member.user.tag}\n**[ID]** ${member.id || 'None'}\n**[ニックネーム]** ${member.nickname || 'None'}\n**[種類]** ${member.bot ? '🤖ボット' : '👤ユーザー'}`
                },
                {
                    name: '__**時間:**__',
                    value: `**[参加日時]** <t:${Math.floor(new Date(member.joinedTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(member.joinedTimestamp) / 1000)}:R>)\n**[作成日時]** <t:${Math.floor(new Date(member.user.createdTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(member.user.createdTimestamp) / 1000)}:R>)`
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        return await interaction.followUp({
            embeds: [memberEmbed]
        });
	},
};