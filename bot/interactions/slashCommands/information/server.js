const { EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    category: 'information',

	data: new SlashCommandBuilder()
		.setName('server')
        .setDescription('Displays this server details.')
        .setDescriptionLocalizations({
            'en-US': 'Displays this server details.',
            'ja': 'サーバーの詳細を表示します。',
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
            .setColor(config.embedColor)
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
                    value: `**[ルールチャンネル]** ${rules_ch}\n**[システムチャンネル]** ${system_ch}\n**[AFKチャンネル]** ${afk_ch}\n**[テキストチャンネル数]** ${guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText).size}\n**[ボイスチャンネル数]** ${guild.channels.cache.filter(ch => ch.type === ChannelType.GuildVoice).size}`,
                    inline: true,
                },
                {
                    name: '__**メンバー数:**__',
                    value: `**[ユーザー]** ${members.filter(member => !member.user.bot).size}\n**[ボット]** ${members.filter(member => member.user.bot).size}\n**[オンライン]** ${members.filter(member => member.presence?.status === 'online').size || '0'}\n**[退席中]** ${members.filter(member => member.presence?.status === 'idle').size || '0'}\n**[オフライン]** ${members.filter(member => member.presence?.status === 'offline').size || '0'}`,
                    inline: true,
                },
                {
                    name: '__**時間:**__',
                    value: `**[作成日]** <t:${Math.floor(new Date(guild.createdTimestamp) / 1000)}:D> (<t:${Math.floor(new Date(guild.createdTimestamp) / 1000)}:R>)`
                }
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        await interaction.reply({
            embeds: [serverEmbed]
        });
    },
};