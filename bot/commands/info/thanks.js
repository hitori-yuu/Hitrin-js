const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('thanks')
        .setNameLocalizations({
            'en-US': 'thanks',
            'ja': 'サンクス',
        })
		.setDescription('Display repositories and other resources that were instrumental in the creation of the bot.')
        .setDescriptionLocalizations({
            'en-US': 'Display repositories and other resources that were instrumental in the creation of the bot.',
            'ja': 'ボット作成時に力をいただいたレポジトリ等を表示します。',
        })
        .setDMPermission(true),

	async execute(interaction) {
        const text = codeBlock('',`discord.js@${require('discord.js').version}\ndiscord-player [Yukitoki - © Snowflake Studio ❄ - 2022]\nHypixel API\nytdl-core\nnode-fetch\nmongoose\nmojang-api\nffmpeg\naxios\nVOICEVOX:四国めたん\nVOICEVOX:ずんだもん\nVOICEVOX:春日部つむぎ\nVOICEVOX:雨晴はう\nVOICEVOX:九州そら`);
        const thanksEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            .setTitle(`スペシャルサンクス`)
            .setDescription('このボットを作成するのに力をいただいたレポジトリ等です。\n' + text)
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        interaction.followUp({
            embeds: [thanksEmbed]
        });
	},
};