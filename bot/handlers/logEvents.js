const fs = require('fs');

async function loadLogEvents(client) {
    const eventFiles = fs
        .readdirSync('logEvents')
        .filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../logEvents/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
            client.events.set(event.name, event);
        } else {
            client.on(
                event.name,
                async (...args) => await event.execute(...args, client)
            );
            client.events.set(event.name, event);
        };
    };
    console.log(client.logEvents.size + '個のクライアントイベントを読み込みました。');
};

module.exports = { loadLogEvents };