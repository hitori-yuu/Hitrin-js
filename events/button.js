const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
		const invalid = new MessageEmbed()
			.setColor('#ba2636')
			.setTitle('実行に失敗')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('存在しないものを指定しています')
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const nick = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('ニックネーム')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('__10秒以内に__設定したいニックネームを入力してください。\n**`-reset`** と入力するとニックネームをリセットします。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const announce = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('お知らせ')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('このサーバーでボットのお知らせを受け取りますか？以下のボタンをクリックし設定てください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const announce_2 = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('お知らせ')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('__15秒以内に__設定したいチャンネルの名前またはIDを入力してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const file = new MessageAttachment('D:/folder/Hitorin/bot/js/v1/materials/sry.png');
		const announce_3 = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('申し訳ございません...')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('__現在この機能は使用することができません__(´;ω;｀)\nそもそもできるのかすらわかりません。\nお知らせ機能を解除したい場合は\n`[設定中のチャンネル] -> [チャンネルの編集]\n -> [連携サービス] -> [フォロー中チャンネル]`\nから__手動で解除__をお願いいたします。\nご不便をおかけしてしまい申し訳ございません。')
			.setThumbnail('attachment://sry.png')
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const announce_log = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('Added follower')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.addFields(
				{ name: '__**Executor:**__', value: `**[Name]** ${interaction.user.tag}\n**[ID]** ${interaction.user.id}\n**[Mention]** <@${interaction.user.id}>` },
				{ name: '__**Server:**__', value: `**[Name]** ${interaction.guild.name}\n**[ID]** ${interaction.guild.id}\n**[Owner]** <@${interaction.guild.ownerId}>` },
				{ name: '__**Channel:**__', value: `**[Name]** ${interaction.channel.name}\n**[ID]** ${interaction.channel.id}` },
			)
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const announce_ok = new MessageButton()
			.setCustomId('announce_ok')
			.setEmoji('<:app:941652983966478417>')
			.setStyle('SUCCESS')
			.setLabel('許可');
		const announce_no = new MessageButton()
			.setCustomId('announce_no')
			.setEmoji('<:pro:941652971018666024>')
			.setStyle('DANGER')
			.setLabel('禁止');

		if (interaction.user.bot) return;
		if (interaction.customId === 'nick') {
			await interaction.reply({
				embeds: [nick],
				ephemeral: false,
			});
			const filter = msg => msg.author.id === interaction.user.id;
			interaction.channel.awaitMessages({ filter, max: 1, time: 10000 })
				.then(collected => {
					if (!collected.size) {return interaction.channel.send('タイムアウト');}
					else if (collected.first().content === '-reset') {
						interaction.channel.send('設定完了: ニックネームをリセットしました。');
						interaction.guild.me.setNickname('');
					}
					else {
						interaction.channel.send('設定完了: **' + collected.first().content + '** に変更しました。');
						interaction.guild.me.setNickname(collected.first().content);
					}
				});
		}
		// message.guild.channels.cache.find((channel) => channel.name === "foo")
		else if (interaction.customId === 'announce') {
			await interaction.reply({
				embeds: [announce],
				components: [new MessageActionRow().addComponents([announce_ok, announce_no])],
				ephemeral: true,
			});
		}
		else if (interaction.customId === 'announce_ok') {
			await interaction.reply({
				embeds: [announce_2],
				ephemeral: true,
			});
			const filter = msg => msg.author.id === interaction.user.id;
			interaction.channel.awaitMessages({ filter, max: 1, time: 15000 })
				.then(collected => {
					if (!collected.size) return interaction.channel.send('タイムアウト');
					const channel = interaction.guild.channels.cache.find((ch) => ch.name === collected.first().content) || interaction.guild.channels.cache.get(collected.first().content);
					if (!channel) return interaction.channel.send({ embeds: [invalid] });
					interaction.channel.send('設定完了: **' + channel.name + '** でお知らせを受け取ります。');
					client.channels.cache.get('879943806118678528').send({ embeds: [announce_log] });
					client.channels.cache.get('913821026377420910').addFollower(channel.id);
				});
		}
		else if (interaction.customId === 'announce_no') {
			await interaction.reply({
				embeds: [announce_3],
				files: [file],
				ephemeral: true,
			});
		}
		else if (interaction.customId === 'welcome') {
			await interaction.reply({
				content: 'ボタンが押されました -> welcome',
				ephemeral: true,
			});
		}
		else if (interaction.customId === 'globalban') {
			await interaction.reply({
				content: 'ボタンが押されました -> globalban',
				ephemeral: false,
			});
		}
		else if (interaction.customId === 'automod') {
			await interaction.reply({
				content: 'ボタンが押されました -> automod',
				ephemeral: false,
			});
		}
	},
};