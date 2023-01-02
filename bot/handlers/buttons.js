const fs = require('fs');

async function loadButtonCommands(client) {
    const buttonCommands = fs.readdirSync('interactions/buttons');

    for (const module of buttonCommands) {
        const commandFiles = fs
            .readdirSync(`interactions/buttons/${module}`)
            .filter((file) => file.endsWith('.js'));

        for (const commandFile of commandFiles) {
            const command = require(`../interactions/buttons/${module}/${commandFile}`);
            client.buttonCommands.set(command.id, command);
        };
    };
    console.log(client.buttonCommands.size + '個のボタンを読み込みました。');
};

module.exports = { loadButtonCommands };