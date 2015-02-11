
//report entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'bootstrap-table', 'lodash', 'mustache', 'util/Templater', 'api/Client'],
        function (_1, _2, _3, _, mustache, Templater, Client) {
            $(function () {
                var client = new Client();

                var urlParams = getUrlParams();
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

                //TODO: render reportData
                var reportSummary = {
                    modelName: "Model 1",
                    author: "Vasya Pupkin",
                    simulationDate: Date.now()
                };

                var stats = {
                    "1": {
                        "name": "Source 1",
                        "type": "source",
                        "useCount": 968
                    },
                    "2": {
                        "name": "Queue 1",
                        "type": "queue",
                        "avgWaitTime": 0.999020568070519,
                        "avgQueueSize": 2.0450450450450477,
                        "useCount": 2046
                    },
                    "5": {
                        "name": "Queue 2",
                        "type": "queue",
                        "avgWaitTime": 0.999020568070519,
                        "avgQueueSize": 2.0450450450450477,
                        "useCount": 2046
                    },
                    "3": {
                        "name": "Splitter 1",
                        "type": "splitter",
                        "useCount": 2042
                    },
                    "4": {
                        "name": "Sink 1",
                        "type": "sink",
                        "useCount": 964
                    }
                };

                var usageStats = [];
                _.forOwn(stats, function (object) {
                    usageStats.push({
                        name: object.name,
                        value: object.useCount
                    });

                    if (object.type == "queue") {
                        var $queueStats = $(mustache.render(templates.queueStats, object));

                        // show queues stats
                        $queueStats.find('table').bootstrapTable({
                            // convert object to array of {key, value} pairs
                            data: _.map(object, function(value, key) {
                                return {key: key, value: value};
                            })
                        });

                        $queueStats.appendTo($queueStatsContainer);
                    }
                });

                // shw report summary
                $('#report-summary-table').bootstrapTable({
                    // convert object to array of {key, value} pairs
                    data: _.map(reportSummary, function(value, key) {
                        return {key: key, value: value};
                    })
                });

                // show usage stats
                $('#usage-stats-table').bootstrapTable({
                    data: usageStats
                });


                $(".accordion").accordion({
                    collapsible: true
                });
            }

            function getUrlParams() {
                var queryDict = {};

                location.search
                    .substr(1)
                    .split("&")
                    .forEach(function (item) {
                        var pair = item.split("=");
                        queryDict[pair[0]] = pair[1];
                    });

                return queryDict;
            }
        }
    );
});