const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require('discord.js');
const guildsModel = require('../models/guildsSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
        if (interaction.user.bot) return;
        if (!interaction.isButton()) return;

		const nick = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('ニックネーム')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('__10秒以内に__設定したいニックネームを入力してください。\n**`-reset`** と入力するとニックネームをリセットします。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const announce = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('お知らせ')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('このサーバーでボットのお知らせを受け取りますか？以下のボタンをクリックし設定してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const announce_2 = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('お知らせ')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('__15秒以内に__設定したいチャンネルの名前またはIDを入力してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const file = new MessageAttachment('D:/folder/Hitrin/bot/js/v1/materials/sry.png');
		const announce_3 = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('申し訳ございません...')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('__現在この機能は使用することができません__(´;ω;｀)\nそもそもできるのかすらわかりません。\nお知らせ機能を解除したい場合は\n`[設定中のチャンネル] -> [チャンネルの編集]\n -> [連携サービス] -> [フォロー中チャンネル]`\nから__手動で解除__をお願いいたします。\nご不便をおかけしてしまい申し訳ございません。')
			.setThumbnail('attachment://sry.png')
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
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
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const welcome = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('新規加入')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('このサーバーで新規加入者の歓迎メッセージを有効にしますか？以下のボタンをクリックし設定してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const welcome_2 = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('新規加入')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('__15秒以内に__設定したいチャンネルの名前またはIDを入力してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const auth = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('新規加入')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('このサーバーで`/auth` コマンドを実行した際に認証権限を取得できる機能を有効にしますか？以下のボタンをクリックし設定してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const auth_2 = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('認証権限')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('__30秒以内に__ `/auth` コマンドを使用する際に取得するロールを **ロールIDまたはロール名** で入力してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const globalban = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('グローバルBAN')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('このサーバーでグローバルBANを有効にしますか？以下のボタンをクリックし設定してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const automod = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('自動管理')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('このサーバーでボットによる自動管理を有効にしますか？以下のボタンをクリックし設定してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
			.setTimestamp();
		const automod_2 = new MessageEmbed()
			.setColor('#89c3eb')
			.setTitle('自動管理')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
			.setDescription('__15秒以内に__自動管理のログを送信するチャンネルをチャンネル名またはチャンネルIDで入力してください。')
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
			.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
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
		const welcome_ok = new MessageButton()
			.setCustomId('welcome_ok')
			.setEmoji('<:app:941652983966478417>')
			.setStyle('SUCCESS')
			.setLabel('許可');
		const welcome_no = new MessageButton()
			.setCustomId('welcome_no')
			.setEmoji('<:pro:941652971018666024>')
			.setStyle('DANGER')
			.setLabel('禁止');
		const auth_ok = new MessageButton()
			.setCustomId('auth_ok')
			.setEmoji('<:app:941652983966478417>')
			.setStyle('SUCCESS')
			.setLabel('許可');
		const auth_no = new MessageButton()
			.setCustomId('auth_no')
			.setEmoji('<:pro:941652971018666024>')
			.setStyle('DANGER')
			.setLabel('禁止');
		const globalban_ok = new MessageButton()
			.setCustomId('globalban_ok')
			.setEmoji('<:app:941652983966478417>')
			.setStyle('SUCCESS')
			.setLabel('許可');
		const globalban_no = new MessageButton()
			.setCustomId('globalban_no')
			.setEmoji('<:pro:941652971018666024>')
			.setStyle('DANGER')
			.setLabel('禁止');
		const automod_ok = new MessageButton()
			.setCustomId('automod_ok')
			.setEmoji('<:app:941652983966478417>')
			.setStyle('SUCCESS')
			.setLabel('許可');
		const automod_no = new MessageButton()
			.setCustomId('automod_no')
			.setEmoji('<:pro:941652971018666024>')
			.setStyle('DANGER')
			.setLabel('禁止');

		if (interaction.user.bot) return;
		if (interaction.customId === 'nick') {
			await interaction.reply({
				embeds: [nick],
			});
			const filter = msg => msg.author.id === interaction.user.id;
			interaction.channel.awaitMessages({ filter, max: 1, time: 10000 })
				.then(collected => {
					if (!collected.size) return interaction.reply('タイムアウト');
					else if (collected.first().content === '-reset') {
						interaction.reply('設定完了: ニックネームをリセットしました。');
						interaction.guild.me.setNickname('');
					}
					else {
						interaction.reply('設定完了: **' + collected.first().content + '** に変更しました。');
						interaction.guild.me.setNickname(collected.first().content);
					}
				});
		}
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
					if (!collected.size) return interaction.reply('タイムアウト');
					const channel = interaction.guild.channels.cache.find((ch) => ch.name === collected.first().content) || interaction.guild.channels.cache.get(collected.first().content);
					if (!channel) return error_invalid(interaction, client, 'チャンネル')
					client.channels.cache.get('879943806118678528').send({ embeds: [announce_log] });
					client.channels.cache.get('913821026377420910').addFollower(channel.id);
					interaction.reply('設定完了: **' + channel.name + '** でお知らせを受け取ります。', { ephemeral: true });
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
				embeds: [welcome],
				components: [new MessageActionRow().addComponents([welcome_ok, welcome_no])],
				ephemeral: true,
			});
		}
		else if (interaction.customId === 'welcome_ok') {
			await interaction.reply({
				embeds: [welcome_2],
				ephemeral: true,
			});
			const filter = msg => msg.author.id === interaction.user.id;
			interaction.channel.awaitMessages({ filter, max: 1, time: 15000 })
				.then(async collected => {
					if (!collected.size) return interaction.reply('タイムアウト');
					const channel = interaction.guild.channels.cache.find((ch) => ch.name === collected.first().content) || interaction.guild.channels.cache.get(collected.first().content);
					if (!channel) return error_invalid(interaction, client, 'チャンネル')
					const guild = await guildsModel.findOneAndUpdate(
						{
							_id: interaction.guild.id,
						},
						{
							$set: {
								welcomeCh: channel.id,
							},
						},
					);
					guild.save();
					interaction.reply('設定完了: <#' + channel.id + '> で新規メンバーへの歓迎メッセージを送ります。', { ephemeral: true });
			});
		}
		else if (interaction.customId === 'welcome_no') {
			const guild = await guildsModel.findOneAndUpdate(
				{
					_id: interaction.guild.id,
				},
				{
					$set: {
						welcomeCh: 'none',
					},
				},
			);
			guild.save();
			interaction.reply('設定完了: このサーバでの新規メンバーへの歓迎メッセージを**無効**にしました', { ephemeral: true });
		}
		else if (interaction.customId === 'auth') {
			await interaction.reply({
				embeds: [auth],
				components: [new MessageActionRow().addComponents([auth_ok, auth_no])],
				ephemeral: true,
			});
		}
		else if (interaction.customId === 'auth_ok') {
			await interaction.reply({
				embeds: [auth_2],
				ephemeral: true,
			});
			const filter = msg => msg.author.id === interaction.user.id;
			interaction.channel.awaitMessages({ filter, max: 1, time: 30000 })
				.then(async collected => {
					if (!collected.size) return interaction.reply('タイムアウト');
					const role = interaction.guild.roles.cache.find((role) => role.name === collected.first().content) || interaction.guild.roles.cache.get(collected.first().content);
					if (!role) return error_invalid(interaction, client, 'ロール');
					const guild = await guildsModel.findOneAndUpdate(
						{
							_id: interaction.guild.id,
						},
						{
							$set: {
								settings: {
									auth_role: role.id,
								}
							},
						},
					);
					guild.save();
					interaction.channel.send('設定完了: **' + role.name + '**を `/auth` コマンドを実行したユーザーに付与します。', { ephemeral: true });
			});
		}
		else if (interaction.customId === 'auth_no') {
			const guild = await guildsModel.findOneAndUpdate(
				{
					_id: interaction.guild.id,
				},
				{
					$set: {
						settings: {
							auth_role: 'none',
						}
					},
				},
			);
			guild.save();
			interaction.reply('設定完了: このサーバでの認証権限を**無効**にしました', { ephemeral: true });
		}
		else if (interaction.customId === 'globalban') {
			await interaction.reply({
				embeds: [globalban],
				components: [new MessageActionRow().addComponents([globalban_ok, globalban_no])],
				ephemeral: true,
			});
		}
		else if (interaction.customId === 'globalban_ok') {
			const guild = await guildsModel.findOneAndUpdate(
				{
					_id: interaction.guild.id,
				},
				{
					$set: {
						globalban: true,
					},
				},
			);
			guild.save();
			interaction.reply('設定完了: このサーバでのグローバルBANを**有効**にしました。', { ephemeral: true });
		}
		else if (interaction.customId === 'globalban_no') {
			const guild = await guildsModel.findOneAndUpdate(
				{
					_id: interaction.guild.id,
				},
				{
					$set: {
						globalban: false,
					},
				},
			);
			guild.save();
			interaction.reply('設定完了: このサーバでのグローバルBANを**無効**にしました。', { ephemeral: true });
		}
		else if (interaction.customId === 'automod') {
			await interaction.reply({
				embeds: [automod],
				components: [new MessageActionRow().addComponents([automod_ok, automod_no])],
				ephemeral: true,
			});
		}
		else if (interaction.customId === 'automod_ok') {
			const guild = await guildsModel.findOneAndUpdate(
				{
					_id: interaction.guild.id,
				},
				{
					$set: {
						autoMod: true,
					},
				},
			);
			guild.save();
			interaction.reply('設定完了: このサーバでの自動管理を**有効**にしました。', { ephemeral: true });
		}
		else if (interaction.customId === 'automod_no') {
			const guild = await guildsModel.findOneAndUpdate(
				{
					_id: interaction.guild.id,
				},
				{
					$set: {
						autoMod: false,
					},
				},
			);
			guild.save();
			interaction.reply('設定完了: このサーバでの自動管理を**無効**にしました。', { ephemeral: true });
		}
	},
};

function error_invalid(interaction, client, invalid) {
	const error = new MessageEmbed()
		.setColor('#ba2636')
		.setTitle('実行失敗')
		.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
		.setDescription(`実行に必須なパラメータが無効です: \`${invalid || 'None'}\``)
		.setFooter({ text: 'Hitrin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
		.setTimestamp();
	return interaction.channel.send({ embeds: [error] });
}