const fs = require('fs');

async function loadSelectCommands(client) {
    const selectMenus = fs.readdirSync('interactions/selectMenus');

    for (const module of selectMenus) {
        const commandFiles = fs
            .readdirSync(`interactions/selectMenus/${module}`)
            .filter((file) => file.endsWith('.js'));
        for (const commandFile of commandFiles) {
            const command = require(`../interactions/selectMenus/${module}/${commandFile}`);
            client.selectCommands.set(command.id, command);
        }
    }
    console.log(client.selectCommands.size + '個のセレクトメニューを読み込みました。');
};

module.exports = { loadSelectCommands };