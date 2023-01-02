const fs = require('fs');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'reload',
	description: 'コマンドを再読み込みします。',
	usage: '[コマンド名]',
    category: 'owner',
	args: true,
	ownerOnly: true,

	execute(message, args) {
		const commandName = args[0].toLowerCase();

		const command =
			message.client.commands.get(commandName) ||
			message.client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			);

		if (!command) {
			if (~commandName.indexOf('h.')) {
				return message.channel.send({ embeds: [CustomErrorEmbed('指定したコマンドは存在しません。', `${config.prefix}reload ${commandName.replace(`${config.prefix}`, '')}`)] });
			};
            return message.channel.send({ embeds: [CustomErrorEmbed('指定したコマンドは存在しません。')] });
		};

		const commandFolders = fs.readdirSync('commands');
		const folderName = commandFolders.find((folder) =>
			fs.readdirSync(`commands/${folder}`).includes(`${command.name}.js`)
		);

		delete require.cache[
			require.resolve(`../${folderName}/${command.name}.js`)
		];

		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);

			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send({
                embeds: [SuccessEmbed(`\`${newCommand.name}\` の再読み込みに成功しました。`)]
			});
		} catch (error) {
			console.error(error);
            message.channel.send({
                embeds: [ErrorEmbed(error)]
            });
		}
	},
};