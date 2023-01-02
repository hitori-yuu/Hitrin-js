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
        };
    };
    console.log(client.slashCommands.size + '個のスラッシュコマンドを読み込みました。');
};

module.exports = { loadSlashCommands };