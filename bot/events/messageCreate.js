const { Collection, ChannelType, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../functions/embeds');
const { isCreatedUser, isCreatedGuild, isAvailableUser } = require('../functions/isAvailable');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData } = require('../functions/MongoDB');
const config = require('../config.json');

const escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
	name: 'messageCreate',

	async execute(message) {
		const { client, guild, channel, content, author } = message;

		if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {
			require('../messages/onMention').execute(message);
			return;
		};

		const checkPrefix = config.prefix.toLowerCase();
		const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(checkPrefix)})\\s*`);

		if (!prefixRegex.test(content.toLowerCase())) return;

		const [matchedPrefix] = content.toLowerCase().match(prefixRegex);
		const args = content.slice(matchedPrefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		if (!message.content.startsWith(matchedPrefix) || message.author.bot) return;

		const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;
		if (command.ownerOnly && message.author.id !== config.owner) {
			return message.channel.send({ embeds: [CustomErrorEmbed('このコマンドは管理者専用です。')] });
		};
		if (command.guildOnly && message.channel.type === ChannelType.DM) {
			return message.channel.send({ embeds: [CustomErrorEmbed('このコマンドはDMでは使用できません。')] });
		};
		if (command.permissions && message.channel.type !== ChannelType.DM) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return message.channel.send({ embeds: [CustomErrorEmbed('あなたにはこのコマンドを使用する権限がありません。')] });
			};
		};
		if (command.args && !args.length) {
			return message.channel.send({ embeds: [CustomErrorEmbed(`有効な引数がありません。\n使用方法: ${config.prefix}${command.name} ${command.usage}`)] });
		};

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.channel.send({ embeds: [CustomErrorEmbed(`${command.name} を使用するにはあと ${timeLeft.toFixed(1)}秒 お待ち下さい。`)] });
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		if (!await isCreatedUser(message.author)) await createUserData(message.author);
		if (!await isCreatedGuild(message.guild)) await createGuildData(message.guild);
		if (await isCreatedUser(message.author)) {
			if (!await isAvailableUser(message.author)) return TOS(message);
		};

		try {
			command.execute(message, args);
		} catch (error) {
			console.error(error);
            message.channel.send({
                embeds: [ErrorEmbed(error)]
            });
		};
	},
};

async function TOS(interaction) {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('consent')
                .setLabel('同意')
                .setStyle(ButtonStyle.Success),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('oppose')
                .setLabel('反対')
                .setStyle(ButtonStyle.Danger),
        );
    const tosEmbed = new EmbedBuilder()
        .setColor('#59b9c6')
        .setAuthor({ name: 'ボットの利用には、利用規約・プライバシーポリシーへの同意が必要です。' })
        .setDescription('‣ [利用規約](https://hitori-yuu.github.io/Hitrin-web/terms.html)\n\n‣ [プライバシーポリシー](https://hitori-yuu.github.io/Hitrin-web/privacy.html)\n\n確認した後、以下のいずれかのボタンをクリックしてください。')

    await interaction.reply({
        embeds: [tosEmbed],
        components: [row],
        ephemeral: true
    });
};