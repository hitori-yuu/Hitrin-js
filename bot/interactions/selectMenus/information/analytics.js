const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder } = require('discord.js');
const { MongoDB, usersData, guildsData, warnsData, wordsData, createUserData, createGuildData, logsData } = require('../../../functions/MongoDB');
const { ErrorEmbed, CustomErrorEmbed, SuccessEmbed } = require('../../../functions/embeds');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const config = require('../../../config.json');

module.exports = {
	id: 'analytics',

	async execute(interaction) {
        const selected = interaction.values[0];

        var analyticsEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({extension: 'png'}), url: interaction.user.displayAvatarURL({extension: 'png'}) })
            .setImage('attachment://chart.png');

        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1200, height: 800 });
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
        const guildData = await guildsData(interaction.guild);
        var row, image, attachment;

        switch (selected) {
            case 'analyticsBreakdown':
                const members = interaction.guild.members.cache;
                const doughnutData = {
                    labels: ['ユーザー', 'ボット'],
                    datasets: [{
                        data: [members.filter(member => !member.user.bot).size, members.filter(member => member.user.bot).size],
                        backgroundColor: [ '#a22041','#53727d' ],
                        hoverOffset: 4
                    }]
                };
                const doughnutChartConfig = {
                    type: 'doughnut',
                    data: doughnutData,
                    plugins: [plugin],
                };
                analyticsEmbed
                    .setTitle(`${interaction.guild.name} のメンバー内訳`)
                    .setDescription(`🟥: ユーザー(${members.filter(member => !member.user.bot).size})\n🟦: ボット(${members.filter(member => member.user.bot).size})`)

                image = await chartJSNodeCanvas.renderToBuffer(doughnutChartConfig);
                attachment = await new AttachmentBuilder(image, { name: 'chart.png' });

                await interaction.update({
                    embeds: [analyticsEmbed],
                    files: [attachment],
                });
                break;
            case 'analyticsTransition':
                const data = await guildData.analytics.members;
                if (!data.date) return interaction.update({ embeds: [CustomErrorEmbed('データがありません。')] });
                const lineData = {
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
                const lineChartConfig = {
                    type: 'line',
                    data: lineData,
                    plugins: [plugin],
                };

                row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('members')
                            .setPlaceholder('表示する日数を選択')
                            .addOptions(
                                {
                                    label: '3日間',
                                    description: '直近3日間のメンバー数推移を表示します。',
                                    value: 'membersThree',
                                },
                                {
                                    label: '7日間',
                                    description: '直近7日間のメンバー数推移を表示します。',
                                    value: 'membersSeven',
                                },
                                {
                                    label: '14日間',
                                    description: '直近14日間のメンバー数推移を表示します。',
                                    value: 'membersFourteen',
                                },
                                {
                                    label: '1ヶ月',
                                    description: '直近1ヶ月間のメンバー数推移を表示します。',
                                    value: 'membersMonth',
                                },
                            ),
                    );
                image = await chartJSNodeCanvas.renderToBuffer(lineChartConfig);
                attachment = await new AttachmentBuilder(image, { name: 'chart.png' });
                analyticsEmbed
                    .setTitle(`${interaction.guild.name} のメンバー数推移（7日間）`);

                await interaction.update({
                    embeds: [analyticsEmbed],
                    files: [attachment],
                    components: [row],
                });
                break;
        }
	},
};