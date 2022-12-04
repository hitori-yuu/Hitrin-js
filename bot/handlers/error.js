const { EmbedBuilder, codeBlock } = require('discord.js');

async function Error(error) {
    console.error('[エラー] エラーが発生しました。\n' + error);
}

async function InteractionError(interaction, error) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setAuthor({ name: 'エラーが発生しました。' })
        .setDescription(codeBlock('js', error))
        .setTimestamp()
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    var args = [];
    var Args = 'None';
    if (!interaction.options.data[0]) {
        args = '';
    } else if (interaction.options.data) {
        if (interaction.options.data[0].options) {
            for (let i = 0; i < interaction.options.data[0].options.length; i++) {
                args.push(`**[${interaction.options.data[0].options[i].name.toUpperCase() || 'None'}]** ${interaction.options.data[0].options[i].value || 'None'}`);
                if (!interaction.options.data[0].options[i]) break;
            }
        } else if (!interaction.options.data[0].options){
            for (let i = 0; i < interaction.options.data.length; i++) {
                args.push(`**[${interaction.options.data[i].name.toUpperCase() || 'None'}]** ${interaction.options.data[i].value || 'None'}`);
                if (!interaction.options.data[i]) break;
            }
        }
        Args = args.join('\n');
    };

    const logEmbed = new EmbedBuilder()
        .setColor('#d9333f')
        .setTitle('エラーログ')
        .setThumbnail(interaction.user.displayAvatarURL({extension: 'png', size: 128}))
        .setDescription(codeBlock('js', error))
        .addFields(
            {
                name: '__**コマンド:**__',
                value: `**[名前]** ${interaction.commandName}`
            },
            {
                name: '__**引数:**__',
                value: Args
            },
            {
                name: '__**実行者:**__',
                value: `**[名前]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[メンション]** <@${interaction.user.id}>`
            },
        )
        .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

    await interaction.followUp({
        embeds: [errorEmbed]
    });
    await interaction.client.channels.cache.get('1023587000261025883').send({
        embeds: [logEmbed]
    });
    console.error('[エラー] エラーが発生しました。\n' + error);
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
        .setAuthor({ name: `Botに必要な権限がありません: ${permission}` })
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

module.exports = { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError };