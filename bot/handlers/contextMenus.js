const fs = require('fs');

async function loadContextMenus(client) {
    const contextMenus = fs.readdirSync('interactions/contextMenus');

    for (const folder of contextMenus) {
        const files = fs
            .readdirSync(`interactions/contextMenus/${folder}`)
            .filter((file) => file.endsWith('.js'));
        for (const file of files) {
            const menu = require(`../interactions/contextMenus/${folder}/${file}`);
            const keyName = `${folder.toUpperCase()} ${menu.data.name}`;
            client.contextMenus.set(keyName, menu);
        };
    };
    console.log(client.contextMenus.size + '個のコンテキストメニューを読み込みました。');
};

module.exports = { loadContextMenus };