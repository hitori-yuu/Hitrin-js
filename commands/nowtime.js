const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require("node-fetch");
require('date-utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowtime')
		.setDescription('現在時刻を表示します。'),
	async execute(interaction) {
		const y = new Date().toFormat('YYYY');
		const m = new Date().toFormat('MM');
		const d = new Date().toFormat('DD');
		const { datelist } = await fetch(`https://koyomi.zingsystem.com/api/?mode=d&cnt=1&targetyyyy=${y}&targetmm=${m}&targetdd=${d}`);
			// interaction.reply('`' + `${res.century}世紀 ${res.gengo} ${res.year}年${res.month}月${res.day}日 第${res.week_number} ${res.week_ja}曜日 ${res.rokuyo} 旧暦${res.old_year}年${res.old_month}月${res.old_date}日` + '`');
			interaction.reply(`${datelist.week}`)
			console.log(datelist.week);
	}
};