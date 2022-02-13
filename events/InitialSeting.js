const { MessageEmbed } = require('discord.js');
const guildsModel = require('../models/guildsSchema');
const profileModel = require('../models/profileSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
        if (interaction.user.bot) return;
        const profileData = profileModel.findOne({ _id: interaction.user.id });
        const guildsData = guildsModel.findOne({ _id: interaction.guild.id });

        // Data
        const profile = profileModel.create({
            _id: interaction.user.id,
            name: interaction.user.username,
            avatar: interaction.user.displayAvatarURL({ format: 'png' }),
            color: 'DEFAULT',
            birthday: {
                date: null,
                public: false,
            },
            description: null,
        });
        const guild = guildsModel.create({
            _id: interaction.guild.id,
            ownerID: interaction.guild.ownerId,
        });

        // Embed
        const initial_profile = new MessageEmbed()
            .setColor('#89c3eb')
            .setTitle('InitialSettings')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png' }), url: interaction.user.displayAvatarURL({ format: 'png' }) })
            .setDescription(`**[_id]** ${profileData._id}\n**[Evaluation]** ${profileData.evaluation}\n**[Coins]** ${profileData.coins}\n**[Avatar]** [URL](${profileData.avatar})\n**[Description]** None\n**[Birthday]** None`)
            .setThumbnail(interaction.user.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Hitorin', iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setTimestamp();

        if (profileData !== null && guildsData !== null) return;
        else {
            if (!profileData && !guildsData) {
                await profile.save();
                await guild.save();
                console.log('(Guild)初期設定が完了しました -> ' + interaction.guild.name);
                console.log('(Member)初期設定が完了しました -> ' + interaction.user.tag);
                setTimeout(() => {
                    client.channels.cache.get('879943806118678528').send({ embeds: [initial_profile] });
                }, 1500);
                return;
            }
            else if (profileData == null) {
                await profile.save();
                console.log('(Member)初期設定が完了しました -> ' + interaction.user.tag);
                setTimeout(() => {
                    client.channels.cache.get('879943806118678528').send({ embeds: [initial_profile] });
                }, 1500);
                return;
            }
            else if (guildsData == null) {
                await guild.save();
                console.log('(Guild)初期設定が完了しました -> ' + interaction.guild.name);
                return;
            }
            else return;
        };
	},
};