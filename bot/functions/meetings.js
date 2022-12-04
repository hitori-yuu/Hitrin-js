const { guildsData } = require("./MongoDB");
const { EmbedBuilder } = require('discord.js');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error')

async function agendas(guild) {
    const Model = require(`../models/meetingsSchema`);
    const DB = await Model.find();
    const Data = await DB.filter(data => data.locate.id === guild.id);

    return Data;
}

async function agendaGet(messageId) {
    const Model = require(`../models/meetingsSchema`);
    const DB = await Model.find();
    const Data = await DB.filter(data => data.messageId === messageId);

    return Data[0];
}

async function agendaCreate(interaction, agenda) {
    const guild = await guildsData(interaction.guild);

    if (guild.settings.meetingChannel === 'None') return CustomError(interaction, '/settings からミーティングチャンネルを先に設定してください。');

    const meetingEmbed = new EmbedBuilder()
        .setColor('#59b9c6')
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
        .setTitle('会議を開始します。')
        .addFields(
            {
                name: '__**議題:**__',
                value: `${agenda}`
            },
        )
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    const message = await interaction.guild.channels.cache.get(guild.settings.meetingChannel).send({
        embeds: [meetingEmbed]
    });
    await interaction.guild.channels.cache.get(guild.settings.meetingChannel).send({
        content: `会議を終了するには次のコマンドを入力してください: \`/agenda-end メッセージid: ${message.id}\``
    })
    const emojis = ['✅', '❌']
    emojis.forEach(emoji => message.react(emoji));
    const Model = require(`../models/meetingsSchema`);
    Model.create({
        agenda: agenda,
        executer: {
            name: interaction.user.username,
            id: interaction.user.id,
        },
        locate: {
            name: interaction.guild.name,
            id: interaction.guild.id,
        },
        messageId: await message.id,
        createdDate: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
    });
}

async function agendaEnd(interaction, messageId) {
    const emojis = ['✅', '❌']
    const Model = require(`../models/meetingsSchema`);
    const guild = await guildsData(interaction.guild);
    const meeting = await agendaGet(messageId);
    const channel = interaction.guild.channels.cache.get(guild.settings.meetingChannel);
    const message = await channel.messages.fetch(messageId);

    const meetingEmbed = new EmbedBuilder()
        .setColor('#59b9c6')
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
        .setTitle('会議を終了しました。')
        .addFields(
            {
                name: '__**議題:**__',
                value: `${meeting.agenda}`
            },
            {
                name: '__**賛成:**__',
                value: `${message.reactions.cache.get(emojis[0]).count - 1}`,
                inline: true,
            },
            {
                name: '__**反対:**__',
                value: `${message.reactions.cache.get(emojis[1]).count - 1}`,
                inline: true,
            },
        )
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    if (guild.settings.meetingChannel !== 'None') {
        await interaction.guild.channels.cache.get(guild.settings.meetingChannel).send({
            embeds: [meetingEmbed]
        });
        const Data = await Model.findOneAndUpdate(
            {
                messageId: messageId,
            },
            {
                $set: {
                    isClosed: true,
                },
            },
        );

        await Data.save();
    }
}

module.exports = { agendas, agendaGet, agendaCreate, agendaEnd };