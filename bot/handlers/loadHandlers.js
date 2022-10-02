async function loadHandlers(client) {
    const { loadEvents } = require('./events');
    const { loadLogging } = require('./logging');
    const { loadContextCommands } = require('./contextCommands');
    const { loadSlashCommands } = require('./slashCommands');
    const { loadButtons } = require('./buttons');
    const { MongoDB } = require('../functions/mongoose');
    loadEvents(client);
    loadLogging(client);
    loadContextCommands(client);
    loadSlashCommands(client);
    loadButtons(client);
    MongoDB();

    console.log(`${client.buttons.size}個 のボタンの読み込みに成功`);
    console.log(`${client.contextCommands.size}個 のコンテキストコマンドの読み込みに成功`);
    console.log(`${client.slashCommands.size}個 のコマンドの読み込みに成功`);
    console.log(`${client.events.size}個 のイベントの読み込みに成功`);
};

module.exports = { loadHandlers };