module.exports = {
	name: 'error',

	async execute(Error) {
        return console.error(Error);
	},
};
