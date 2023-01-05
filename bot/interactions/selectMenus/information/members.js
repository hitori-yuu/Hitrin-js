const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder } = require('discord.js');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData, logsData } = require('../../../functions/MongoDB');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const config = require('../../../config.json');

module.exports = {
	id: 'members',

	async execute(interaction) {
        const selected = interaction.values[0];

        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1200, height: 800 });
        const guildData = await guildsData(interaction.guild);
        const data = await guildData.analytics.members;
        var membersEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }), url: interaction.user.displayAvatarURL({ extension: 'png' }) })
            .setTimestamp()
            .setFooter({ text: '© 2021-2022 HitoriYuu, Hitrin' });
        var Data;

        switch (selected) {
            case 'membersThree':
                membersEmbed
                    .setTitle(`${interaction.guild.name} のメンバー数推移（3日間）`)
                Data = {
                    labels: data.date.slice(-3),
                    datasets: [
                        {
                            label: '総メンバー数',
                            data: data.member.slice(-3),
                            borderColor: '#4d4398',
                            borderWidth: 4,
                            tension: 0.1
                        },
                        {
                            label: 'ユーザー数',
                            data: data.user.slice(-3),
                            borderColor: '#a22041',
                            borderWidth: 4,
                            tension: 0.1
                        },
                        {
                            label: 'ボット数',
                            data: data.bot.slice(-3),
                            borderColor: '#53727d',
                            borderWidth: 4,
                            tension: 0.1
                        }
                    ]
                };
                break;
            case 'membersSeven':
                membersEmbed
                    .setTitle(`${interaction.guild.name} のメンバー数推移（7日間）`);

                Data = {
                    labels: data.date.slice(-7),
                    datasets: [
                        {
                            label: '総メンバー数',
                            data: data.member.slice(-7),
                            borderColor: '#4d4398',
                            borderWidth: 4,
                            tension: 0.1
                        },
                        {
                            label: 'ユーザー数',
                            data: data.user.slice(-7),
                            borderColor: '#a22041',
                            borderWidth: 4,
                            tension: 0.1
                        },
                        {
                            label: 'ボット数',
                            data: data.bot.slice(-7),
                            borderColor: '#53727d',
                            borderWidth: 4,
                            tension: 0.1
                        }
                    ]
                };
                break;
            case 'membersFourteen':
                membersEmbed
                    .setTitle(`${interaction.guild.name} のメンバー数推移（14日間）`);
                Data = {
                    labels: data.date.slice(-14),
                    datasets: [
                        {
                            label: '総メンバー数',
                            data: data.member.slice(-14),
                            borderColor: '#4d4398',
                            borderWidth: 4,
                            tension: 0.1
                        },
                        {
                            label: 'ユーザー数',
                            data: data.user.slice(-14),
                            borderColor: '#a22041',
                            borderWidth: 4,
                            tension: 0.1
                        },
                        {
                            label: 'ボット数',
                            data: data.bot.slice(-14),
                            borderColor: '#53727d',
                            borderWidth: 4,
                            tension: 0.1
                        }
                    ]
                };
                break;
            case 'membersMonth':
                membersEmbed
                    .setTitle(`${interaction.guild.name} のメンバー数推移（1ヶ月間）`);
                Data = {
                    labels: data.date.slice(-30),
                    datasets: [
                        {
                            label: '総メンバー数',
                            data: data.member.slice(-30),
                            borderColor: '#4d4398',
                            borderWidth: 4,
                            tension: 0.1
                        },
                        {
                            label: 'ユーザー数',
                            data: data.user.slice(-30),
                            borderColor: '#a22041',
                            borderWidth: 4,
                            tension: 0.1
                        },
                        {
                            label: 'ボット数',
                            data: data.bot.slice(-30),
                            borderColor: '#53727d',
                            borderWidth: 4,
                            tension: 0.1
                        }
                    ]
                };
                break;
        }

        const plugin = {
            id: 'custom_canvas_background_color',
            beforeDraw: (chart) => {
              const ctx = chart.canvas.getContext('2d');
              ctx.save();
              ctx.globalCompositeOperation = 'destination-over';
              ctx.fillStyle = '#e8ecef';
              ctx.fillRect(0, 0, chart.width, chart.height);
              ctx.restore();
            }
        };
        const chartConfig = {
            type: 'line',
            data: Data,
            plugins: [plugin],
        };

        const image = await chartJSNodeCanvas.renderToBuffer(chartConfig);
        const attachment = await new AttachmentBuilder(image, { name: 'chart.png' });

        membersEmbed
            .setImage('attachment://chart.png')

        return await interaction.update({
            embeds: [membersEmbed],
            files: [attachment],
        });
	},
};