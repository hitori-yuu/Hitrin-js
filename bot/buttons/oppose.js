const usersModel = require('../models/usersSchema');

module.exports = {
	id: 'oppose',

	async execute(interaction) {
		const userData = await usersModel.findOneAndUpdate(
            {
                id: interaction.user.id,
            },
            {
                $set: {
                    tos: false,
                },
            },
        );

		userData.save();
		interaction.followUp({
			content: '利用規約に**反対**しました。',
		});
		return;
	},
};
