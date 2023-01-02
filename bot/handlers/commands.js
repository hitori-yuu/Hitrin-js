const fs = require('fs');

async function loadCommands(client) {
    const commandFolders = fs.readdirSync('./commands');

    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`commands/${folder}`)
            .filter((file) => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            client.commands.set(command.name, command);

            switch (command.category) {
                case 'misc':
                    client.commandsMisc.set(command.name, command);
                    break;
                case 'information':
                    client.commandsInfo.set(command.name, command);
                    break;
                case 'tts':
                    client.commandsTts.set(command.name, command);
                    break;
                case 'owner':
                    client.commandsOwner.set(command.name, command);
                    break;
            };
        };
    };
    console.log(client.commands.size + '個のコマンドを読み込みました。');
};

module.exports = { loadCommands };