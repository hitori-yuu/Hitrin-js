const fs = require('fs');

async function loadButtons(client) {
    const buttonDir = fs.readdirSync('buttons');

    for (const file of buttonDir) {
        const button = require(`../buttons/${file}`);

		client.buttons.set(button.id, button);
    };
};

module.exports = { loadButtons };