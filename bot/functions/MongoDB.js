const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');
require('dotenv').config()

async function MongoDB() {
    try {
        mongoose
        .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
        })
        .then(() => {
            console.log('データベースに接続しました。');
        });
    } catch (error) {
        return console.error(error);
    }
    return;
};

async function usersData(user) {
    const Model = require(`../models/usersSchema`);
    const DB = await Model.find();
    const Data = await DB.filter(data => data.id === user.id);

    return Data[0];
};

async function guildsData(guild) {
    const Model = require(`../models/guildsSchema`);
    const DB = await Model.find();
    const Data = await DB.filter(data => data.id === guild.id);

    return Data[0];
};

async function warnsData(member) {
    const Model = require(`../models/warnsSchema`);
    const DB = await Model.find();
    const Data = await DB.filter(data => data.id === member.id);

    return Data;
};

async function wordsData(word) {
    const Model = require(`../models/wordsSchema`);
    const DB = await Model.find();
    const Data = await DB.filter(data => data.word === word);

    return Data;
};

async function logsData() {
    const Model = require(`../models/logsSchema`);
    const Data = await Model.find();

    return Data;
};

async function createUserData(user) {
    const Model = require(`../models/usersSchema`);
    Model.create({
        id: user.id,
        name: user.username,
        tos: false,
        evaluation: 10,
        speaker: 5,
        profile: {
            avatar: user.displayAvatarURL({ format: 'png'}),
            color: 'BLACK',
            description: null,
            birthday: {
                date: null,
                public: false,
            }
        },
        createDate: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
    });
    const userEmbed = new EmbedBuilder()
        .setColor('#59b9c6')
        .setTitle('ユーザー初期設定')
        .setThumbnail(user.displayAvatarURL({extension: 'png', size: 128}))
        .setDescription(`ユーザーの初期設定が完了しました。`)
        .addFields(
            {
                name: '__**ユーザー:**__',
                value: `**[名前]** ${user.tag}\n**[ID]** ${user.id}`
            },
        )

    await user.client.channels.cache.get('1022444125980741642').send({
        embeds: [userEmbed]
    });
};

async function createGuildData(guild) {
    const Model = require(`../models/guildsSchema`);
    Model.create({
        id: guild.id,
        name: guild.name,
        createdDate: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
    });

    const serverEmbed = new EmbedBuilder()
        .setColor('#59b9c6')
        .setTitle('サーバー初期設定')
        .setThumbnail(guild.iconURL({ extension: 'png' }))
        .setDescription(`サーバーの初期設定が完了しました。`)
        .addFields(
            {
                name: '__**サーバー:**__',
                value: `**[名前]** ${guild.name}\n**[ID]** ${guild.id}`
            },
        )

    await guild.client.channels.cache.get('1022444125980741642').send({
        embeds: [serverEmbed]
    });
};

module.exports = { MongoDB, usersData, guildsData, warnsData, wordsData, logsData, createUserData, createGuildData };