const { consentTOS, opposeTOS } = require('../../../functions/TOS');

module.exports = {
	id: 'oppose',

	async execute(interaction) {
        opposeTOS(interaction);
	},
};
