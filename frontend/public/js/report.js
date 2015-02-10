
//report entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'bootstrap-table'],
        function (_1, _2, _3) {
            $(function () {
                alert("report.js");

                var data = [
                    {
                        name: "Source 1",
                        value: 100
                    },
                    {
                        name: "Queue 1",
                        value: 221
                    },                    {
                        name: "Splitter 1",
                        value: 221
                    },                    {
                        name: "Sink 1",
                        value: 100
                    }
                ];

                $('#usage-stats-table').bootstrapTable({
                    data: data
                });
            });
        }
    );
});