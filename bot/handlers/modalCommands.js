const fs = require('fs');

async function loadModalCommands(client) {
    const modalCommands = fs.readdirSync('interactions/modals');

    for (const module of modalCommands) {
        const commandFiles = fs
            .readdirSync(`interactions/modals/${module}`)
            .filter((file) => file.endsWith('.js'));

        for (const commandFile of commandFiles) {
            const command = require(`../interactions/modals/${module}/${commandFile}`);
            client.modalCommands.set(command.id, command);
        };
    };
    console.log(client.modalCommands.size + '個のモダルコマンドを読み込みました。');
};

module.exports = { loadModalCommands };