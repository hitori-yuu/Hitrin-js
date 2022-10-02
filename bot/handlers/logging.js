const fs = require('fs');

async function loadLogging(client) {
    const eventDir = fs.readdirSync('logging');

    for (const file of eventDir) {
        const event = require(`../logging/${file}`);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(
                event.name,
                async (...args) => await event.execute(...args, client)
            );
        }
    };
};

module.exports = { loadLogging };