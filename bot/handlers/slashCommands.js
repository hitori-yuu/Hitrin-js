const fs = require('fs');

async function loadSlashCommands(client) {
    const commandDir = fs.readdirSync('commands');

    for (const module of commandDir) {
        const commandFiles = fs
            .readdirSync(`commands/${module}`)
            .filter((file) => file.endsWith('.js'));

        for (const commandFile of commandFiles) {
            const command = require(`../commands/${module}/${commandFile}`);
            client.slashCommands.set(command.data.name, command);
        }
    };
};

module.exports = { loadSlashCommands };