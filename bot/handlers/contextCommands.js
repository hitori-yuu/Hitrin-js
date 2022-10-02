const fs = require('fs');

async function loadContextCommands(client) {
    const commandDir = fs.readdirSync('context');

    for (const module of commandDir) {
        const commandFiles = fs
            .readdirSync(`context/${module}`)
            .filter((file) => file.endsWith('.js'));

        for (const commandFile of commandFiles) {
            const command = require(`../context/${module}/${commandFile}`);
            client.contextCommands.set(command.data.name, command);
        }
    };
};

module.exports = { loadContextCommands };