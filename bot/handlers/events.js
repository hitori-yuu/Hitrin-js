const fs = require('fs');

async function loadEvents(client) {
    const eventDir = fs.readdirSync('events');

    for (const file of eventDir) {
        const event = require(`../events/${file}`);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
            client.events.set(event.name);
        } else {
            client.on(
                event.name,
                async (...args) => await event.execute(...args, client)
            );
            client.events.set(event.name);
        }
    };
};

module.exports = { loadEvents };