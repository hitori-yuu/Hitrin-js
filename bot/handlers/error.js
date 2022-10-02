const { EmbedBuilder, codeBlock } = require('discord.js');

async function Error(error) {
    console.error('[エラー] エラーが発生しました。\n' + error);
}

async function InteractionError(error, interaction) {
    const error_message = codeBlock('js', error);
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: 'エラーが発生しました。' })
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    const logEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
        .setDescription(error_message)
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    interaction.channel.send({
        embeds: [errorEmbed]
    });
    interaction.client.channels.cache.get('1023587000261025883').send({
        embeds: [logEmbed]
    });
    console.error('[エラー] エラーが発生しました。\n内容: ' + error.message);
};

async function PermissionError(interaction, permission) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: `あなたには、実行するために必要な権限がありません: \`${permission}\`` })
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    await interaction.followUp({
        embeds: [errorEmbed]
    });
};

async function ArgumentError(interaction, args) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: `あなたには、実行するために必要な引数がないまたは無効です: \`${args}\`` })
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    await interaction.followUp({
        embeds: [errorEmbed]
    });
};

async function TTSError(error, message) {
    message.react('🔇');
    setTimeout(() => {
        message.reactions.cache.get('🔇').remove()
    }, 3000);
    console.error('[エラー] エラーが発生しました。\n内容: ' + error.message);
};

module.exports = { Error, InteractionError, PermissionError, ArgumentError, TTSError };