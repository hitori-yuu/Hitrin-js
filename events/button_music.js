const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
        if (interaction.user.bot) return;
        if (!interaction.isButton()) return;

        const file = new MessageAttachment('D:/folder/Hitrin/bot/js/v1/materials/music.png');
        if (interaction.customId === 'skip') {
            const queue = client.distube.getQueue(interaction)
            if (!queue) return interaction.reply(`キューに曲がありません`)
            queue.skip()
            await interaction.reply('スキップしました。')
        }
        if (interaction.customId === 'stop') {
            const queue = client.distube.getQueue(interaction)
            if (!queue) return interaction.reply(`キューに曲がありません`)
            queue.stop()
            await interaction.reply('停止しました。')
        }
        if (interaction.customId === 'pause_resume') {
            const queue = client.distube.getQueue(interaction)
            if (!queue) return interaction.reply(`キューに曲がありません`)
            if (queue.paused) {
                queue.resume()
                await interaction.reply('一時停止中の曲を再生します。')
            }
            else if (!queue.paused) {
                queue.pause()
                await interaction.reply('再生中の曲を一時停止しました。')
            }
        }
        if (interaction.customId === 'repeat') {
            const queue = client.distube.getQueue(interaction)
            if (!queue) return interaction.reply(`キューに曲がありません`)
            if (queue.repeatMode == 0) {
                client.distube.setRepeatMode(interaction, 1);
                await interaction.reply('リピート設定: `この曲`')
            }
            else if (queue.repeatMode == 1) {
                client.distube.setRepeatMode(interaction, 0);
                await interaction.reply('リピート設定: `オフ`')
            }
            else if (queue.repeatMode == 2) {
                client.distube.setRepeatMode(interaction, 0);
                await interaction.reply('リピート設定: `オフ`')
            }
        }
        if (interaction.customId === 'status') {
            const queue = client.distube.getQueue(interaction)
            if (!queue) return interaction.reply(`キューに曲がないため表示できません。`)
            const status_embed = new MessageEmbed()
                .setColor('#89c3eb')
                .setAuthor({ name: 'ステータス', iconURL: 'attachment://music.png'})
                .addFields(
                    { name: '__**音量:**__', value: `${queue.volume}%`, inline: true },
                    { name: '__**リピート:**__', value: queue.repeatMode ? (queue.repeatMode === 2 ? '再生リスト' : '現在の曲') : 'オフ', inline: true },
                    { name: '__**自動再生:**__', value: queue.autoplay ? 'オン' : 'オフ', inline: true },
                    { name: '__**加工:**__', value: queue.filters.join(', ') || 'オフ', inline: false },
                )
                .setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
                .setTimestamp();
            await interaction.reply({embeds: [status_embed], files: [file]});
        }
	},
};