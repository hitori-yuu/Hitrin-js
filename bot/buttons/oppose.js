const { consentTOS, opposeTOS } = require('../functions/TOS');
const { Error, InteractionError, PermissionError, BotPermissionError, ArgumentError, TTSError, CustomError } = require('../handlers/error');

module.exports = {
	id: 'oppose',

	async execute(interaction) {
        try {
            opposeTOS(interaction);
        } catch (error) {
            return InteractionError(interaction, error);
        }
	},
};
