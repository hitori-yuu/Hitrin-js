const fs = require('fs');

async function loadSlashCommands(client) {
    const slashCommands = fs.readdirSync('interactions/slashCommands');

    for (const module of slashCommands) {
        const commandFiles = fs
            .readdirSync(`interactions/slashCommands/${module}`)
            .filter((file) => file.endsWith('.js'));

        for (const commandFile of commandFiles) {
            const command = require(`../interactions/slashCommands/${module}/${commandFile}`);
            client.slashCommands.set(command.data.name, command);
            switch (command.category) {
                case 'misc':
                    client.slashCommandsMisc.set(command.data.name, command);
                    break;
                case 'information':
                    client.slashCommandsInfo.set(command.data.name, command);
                    break;
                case 'tts':
                    client.slashCommandsTts.set(command.data.name, command);
                    break;
                case 'owner':
                    client.slashCommandsOwner.set(command.data.name, command);
                    break;
            };
        };
    };
    console.log(client.slashCommands.size + '個のスラッシュコマンドを読み込みました。');
};

module.exports = { loadSlashCommands };