const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
        .setNameLocalizations({
            'en-US': 'server',
            'ja': 'サーバー',
        })
		.setDescription('Display information about this server.')
        .setDescriptionLocalizations({
            'en-US': 'Display information about this server.',
            'ja': 'サーバーの情報を表示します。',
        })
        .setDMPermission(false),

	async execute(interaction) {
        const guild = interaction.guild;


        const members = guild.members.cache;
        var afk_ch = 'None';
        var rules_ch = 'None';
        var system_ch = 'None';
        if (guild.afkChannelId) afk_ch = `<#${guild.afkChannelId}> (${guild.afkTimeout}秒)`;
        if (guild.rulesChannelId) rules_ch = `<#${guild.rulesChannelId}>`;
        if (guild.systemChannelId) system_ch = `<#${guild.systemChannelId}>`;

        const serverEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            .setTitle(`${guild.name} の詳細`)
            .setThumbnail(guild.iconURL({extension: 'png'}))
            .addFields(
                {
                    name: '__**一般:**__',
                    value: `**[名前]** ${guild.name}\n**[説明]** ${guild.description || 'None'}\n**[オーナー]** <@${guild.ownerId}>`
                },
                {
                    name: '__**チャンネル:**__',
                    value: `**[ルールチャンネル]** ${rules_ch}\n**[システムチャンネル]** ${system_ch}\n**[AFKチャンネル]** ${afk_ch}\n**[テキストチャンネル数]** ${guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText).size}\n**[ボイスチャンネル数]** ${guild.channels.cache.filter(ch => ch.type === ChannelType.GuildVoice).size}`
                },
                {
                    name: '__**メンバー:**__',
                    value: `**[ユーザー]** ${members.filter(member => !member.user.bot).size}\n**[ボット]** ${members.filter(member => member.user.bot).size}\n**[オンライン]** ${members.filter(member => member.user.presence?.status === 'online').size || '0'}\n**[退席中]** ${members.filter(member => member.presence?.status === 'idle').size || '0'}\n**[オフライン]** ${members.filter(member => member.user.presence?.status === 'offline').size || '0'}`
                }
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        interaction.followUp({
            embeds: [serverEmbed]
        });
	},
};
