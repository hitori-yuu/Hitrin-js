const fs = require('fs');

async function loadAnalytics(client) {
    const eventFiles = fs
        .readdirSync('analytics')
        .filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../analytics/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
            client.analytics.set(event.name, event);
        } else {
            client.on(
                event.name,
                async (...args) => await event.execute(...args, client)
            );
            client.analytics.set(event.name, event);
        };
    };
    console.log(client.analytics.size + '個のアナリティクスを読み込みました。');
};

module.exports = { loadAnalytics };