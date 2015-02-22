define(['jquery'], function($) {
        /**
         * Deals with simulation process and stats visualisation
         */
        var StatsManager = Class.create({
            initialize: function (windows) {
                this.windows = windows;
            },

            onProgress: function(value) {
                this.windows.$progress.val(value);
                this.windows.$progressLabel.text(parseInt(value, 10) + '%');
            },

            onComplete: function(stats) {
                $("#simulation-complete-dialog").dialog({
                    width: "50%",
                    modal: true,
                    show: {
                        effect: "fade",
                        duration: 300
                    },
                    hide: {
                        effect: "fade",
                        duration: 300
                    },
                    buttons: {
                        "Yes": function() {
                            window.open('/report?taskId=' + stats.taskId, '_blank');
                            $(this).dialog("close");
                        },
                        "No": function() {
                            $(this).dialog("close");
                        }
                    }
                });
            },

            onError: function(error, reason) {
                alert("Error");
                alert(error);
                alert(reason);
            }
        });

        return StatsManager;
    }
);
