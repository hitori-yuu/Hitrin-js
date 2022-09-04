const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const warnsModel = require('../../models/warnsSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
        .setNameLocalizations({
            'en-US': 'warn',
            'ja': '警告',
        })
		.setDescription('Displays information about that member.')
        .setDescriptionLocalizations({
            'en-US': 'Displays information about that member.',
            'ja': '指定したメンバーに警告します。',
        })
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(
            option => option
            .setName('member')
            .setNameLocalizations({
                'en-US': 'member',
                'ja': 'メンバー',
            })
            .setDescription('Select a member.')
            .setDescriptionLocalizations({
                'en-US': 'Select a member.',
                'ja': 'メンバーを選択。',
            })
            .setRequired(true)
        )
        .addStringOption(
            option => option
            .setName('reason')
            .setNameLocalizations({
                'en-US': 'reason',
                'ja': '理由',
            })
            .setDescription('Enter the reason.')
            .setDescriptionLocalizations({
                'en-US': 'Enter the reason.',
                'ja': '理由を入力。',
            })
            .setRequired(true)
        ),

	async execute(interaction, client) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason');

        const warnEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL(), url: interaction.user.displayAvatarURL() })
            .setTitle(`${member.user.username} に警告しました。`)
            .setThumbnail(member.displayAvatarURL({format: 'png', size: 128}))
            .addFields(
                {
                    name: '__**対象:**__',
                    value: `**[名前]** ${member.user.tag}\n**[ID]** ${member.id || 'None'}`
                },
                {
                    name: '__**理由:**__',
                    value: reason
                },
            )
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const warnedEmbed = new EmbedBuilder()
            .setColor('#59b9c6')
            .setTitle(`${interaction.guild.name} にて警告されました。`)
            .setThumbnail(interaction.guild.iconURL({format: 'png', size: 128}))
            .setDescription('**[理由]**\n' + reason)
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });

        const warnData = await warnsModel.create({
            guild: {
                name: interaction.guild.name,
                id: interaction.guild.id
            },
            subject: {
                name: member.user.tag,
                id: member.user.id
            },
            author: {
                name: interaction.user.tag,
                id: interaction.user.id
            },
            reason: reason
        });
        warnData.save();
        interaction.followUp({
            embeds: [warnEmbed]
        });
        member.send({
            embeds: [warnedEmbed]
        });
	},
};
