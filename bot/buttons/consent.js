const { consentTOS, opposeTOS } = require('../functions/TOS');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');

module.exports = {
	id: 'consent',

	async execute(interaction) {
        try {
            consentTOS(interaction);
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
