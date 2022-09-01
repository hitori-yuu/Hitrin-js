const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
        .setNameLocalizations({
            'en-US': 'server',
            'ja': 'サーバー',
        })
		.setDescription('Displays information about this server.')
        .setDescriptionLocalizations({
            'en-US': 'Displays information about this server.',
            'ja': 'サーバーの情報を表示します。',
        })
        .setDMPermission(false),

	async execute(interaction, client) {
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
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL(), url: interaction.user.displayAvatarURL() })
        .setTitle(`${guild.name} の詳細`)
        .setThumbnail(guild.iconURL())
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
                value: `**[ユーザー数]** ${members.filter(member => !member.bot).size}\n**[ボット数]** ${members.filter(member => member.user.bot).size}\n**[オンラインメンバー数]** ${members.filter(member => member.user.presence?.status === 'online').size || '0'}\n**[AFKメンバー数]** ${members.filter(member => member.presence?.status === 'idle').size || '0'}\n**[オフラインメンバー数]** ${members.filter(member => member.user.presence?.status === 'offline').size || '0'}`
            }
        )
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        interaction.followUp({
            embeds: [serverEmbed]
        });
	},
};
