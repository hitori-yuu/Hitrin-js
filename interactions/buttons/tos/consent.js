const usersModel = require('../../../models/usersSchema');

module.exports = {
	id: 'consent',

	async execute(interaction) {
        const userData = await usersModel.findOneAndUpdate(
            {
                id: interaction.user.id,
            },
            {
                $set: {
                    tos: true,
                },
            },
        );

		userData.save();
		interaction.followUp({
			content: '利用規約に**同意**しました。',
		});
		return;
	},
};
