const { EmbedBuilder, codeBlock } = require('discord.js');

function ErrorEmbed(error) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: 'エラーが発生しました。' })
        .setDescription(codeBlock('js', error))
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    return errorEmbed;
};

function CustomErrorEmbed(text, maybe) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setDescription(`❌ ${text}`)

    if (maybe) {
        errorEmbed
            .setFooter({ text: `もしかして ${maybe}` });
    };

    return errorEmbed;
};

function SuccessEmbed(text, footer) {
    const successEmbed = new EmbedBuilder()
        .setColor('#93ca76')
        .setDescription(`✅ ${text}`)

    if (footer) {
        successEmbed
            .setFooter({ text: footer });
    };

    return successEmbed;
};

module.exports = { ErrorEmbed, CustomErrorEmbed, SuccessEmbed };