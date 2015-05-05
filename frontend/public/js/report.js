
//report entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery',
            'jquery-ui',
            'bootstrap-table',
            'jquery.flot',
            'lodash',
            'mustache',
            'util/Templater',
            'util/Url',
            'api/Client',
            'editor/StringRes'],

        function (_1, _2, _3, flot, _, mustache, Templater, Url, Client, StringRes) {
            $(function () {
                var client = new Client();

                var urlParams = Url.getParams();
                var taskId = urlParams.taskId;

                client.getReport(taskId, {
                    onComplete: function (data) {
                        renderReport(data);
                    },
                    onError: function (error) {
                        alert("AJAX error");
                    }
                });
            });

            function renderReport(reportData) {
                var templates = {
                    queueStats: Templater.makeTemplate('#queue-stats-template')
                };

                var $queueStatsContainer = $('#queue-stats-container');

                var reportSummary = reportData.reportSummary;
                var stats = reportData.stats;

                var usageStats = [];
                _.forOwn(stats, function (object) {
                    usageStats.push({
                        name: object.name,
                        value: object.useCount
                    });

                    if (object.type == "queue") {
                        var $queueStats = $(mustache.render(templates.queueStats, object));

                        // show queues stats
                        var $queueTable = $queueStats.find('table');
                        $queueTable.bootstrapTable({
                            // convert object to array of {key, value} pairs
                            data: _.map(StringRes.report.queue,
                                function(value, key) {
                                    return {key: value, value: object[key]};
                                }
                            ),
                            columns: [{
                                field: 'key',
                                title: StringRes.reportPage.key
                            }, {
                                field: 'value',
                                title: StringRes.reportPage.value,
                                formatter: floatFormatter
                            }]
                        });

                        // add table to page to calc dimensions
                        $queueStats.appendTo($queueStatsContainer);

                        // add plots
                        var $waitPlot = $queueStats.find('.wait_time_vs_time_plot');
                        $waitPlot.height($queueTable.height());

                        var $sizePlot = $queueStats.find('.queue_size_vs_time_plot');
                        $sizePlot.height($queueTable.height());

                        var waitData = [{
                            data: object.queueTimePlot
                        }];

                        var sizeData = [{
                            data: object.queueSizePlot
                        }];

                        $.plot($waitPlot, waitData, {
                            series: {
                                lines: { show: true },
                                points: { show: true }
                            },
                            xaxis: {
                                tickDecimals: 0
                            }
                        });

                        $.plot($sizePlot, sizeData, {
                            series: {
                                lines: { show: true },
                                points: { show: true }
                            },
                            xaxis: {
                                tickDecimals: 0
                            }
                        });
                    }
                });

                // shw report summary
                $('#report-summary-table').bootstrapTable({
                    // convert object to array of {key, value} pairs
                    data: _.map(reportSummary, function(value, key) {
                        return {key: StringRes.report[key], value: value};
                    })
                });

                // show usage stats
                $('#usage-stats-table').bootstrapTable({
                    data: usageStats,
                    columns: [{
                        field: 'name',
                        title: StringRes.reportPage.name
                    }, {
                        field: 'value',
                        title: StringRes.reportPage.value,
                        formatter: floatFormatter
                    }]
                });


                $(".accordion").accordion({
                    collapsible: true
                });
            }

            function floatFormatter (value) {
                if (_.isNumber(value) && !isInt(value)) {
                    return value.toFixed(2);
                } else {
                    return value;
                }
            }

            function isInt(n) {
                return n % 1 === 0;
            }
        }
    );
});