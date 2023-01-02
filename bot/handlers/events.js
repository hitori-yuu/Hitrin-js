const fs = require('fs');

async function loadEvents(client) {
    const eventFiles = fs
        .readdirSync('events')
        .filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
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
    console.log(client.events.size + '個のイベントを読み込みました。');
};

module.exports = { loadEvents };