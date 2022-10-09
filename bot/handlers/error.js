const { EmbedBuilder, codeBlock } = require('discord.js');

async function Error(error) {
    console.error('[エラー] エラーが発生しました。\n' + error);
}

async function InteractionError(error, interaction) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: 'エラーが発生しました。' })
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    const logEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
        .setDescription(codeBlock('js', error))
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    await interaction.followUp({
        embeds: [errorEmbed]
    });
    interaction.client.channels.cache.get('1023587000261025883').send({
        embeds: [logEmbed]
    });
    console.log('[エラー] エラーが発生しました。\n' + error);
    interaction.client.errors.set(interaction.id, interaction.user.username);
};

async function PermissionError(interaction, permission) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: `あなたに実行するために必要な権限がありません: \`${permission}\`` })
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    await interaction.followUp({
        embeds: [errorEmbed]
    });
};

async function BotPermissionError(interaction, permission) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: `Botに必要な権限がありません。` })
        .setDescription(codeBlock(permission))
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    await interaction.followUp({
        embeds: [errorEmbed]
    });
};

async function ArgumentError(interaction, args) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: `実行するために必要な引数がないまたは無効です。` })
        .setDescription(`無効な引数: \`${args}\``)
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
    console.log('[エラー] エラーが発生しました。\n' + error);
};

async function CustomError(interaction, message) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: `エラーが発生しました。` })
        .setDescription(codeBlock(message))
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    await interaction.followUp({
        embeds: [errorEmbed]
    });
};

module.exports = { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError};