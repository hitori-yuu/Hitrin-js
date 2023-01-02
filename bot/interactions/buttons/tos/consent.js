const { consentTOS, opposeTOS } = require('../../../functions/TOS');

module.exports = {
	id: 'consent',

	async execute(interaction) {
        consentTOS(interaction);
	},
};
