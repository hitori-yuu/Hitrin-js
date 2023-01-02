const fs = require('fs');

async function loadAutocompleteInteractions(client) {
    const autocompleteInteractions = fs.readdirSync('interactions/autocomplete');

    for (const module of autocompleteInteractions) {
        const files = fs
            .readdirSync(`interactions/autocomplete/${module}`)
            .filter((file) => file.endsWith('.js'));

        for (const interactionFile of files) {
            const interaction = require(`../interactions/autocomplete/${module}/${interactionFile}`);
            client.autocompleteInteractions.set(interaction.name, interaction);
        };
    };
    console.log(client.autocompleteInteractions.size + '個のオートコンプリートコマンドを読み込みました。');
};

module.exports = { loadAutocompleteInteractions };