define(['jquery'], function($) {
        /**
         * Deals with simulation process and stats visualisation
         * @param windows {Object}
         * @constructor
         */
        function StatsManager(windows) {
            var self = this;

            this.onProgress = function(value) {
                windows.$progress.val(value);
                windows.$progressLabel.text(parseInt(value, 10) + '%');
            };

            this.onComplete = function(stats) {
                $("#simulation-complete-dialog").dialog({
                    width: "50%",
                    modal: true,
                    buttons: {
                        "Yes": function() {
                            window.open('/report?' + stats.taskId, '_blank');
                            $(this).dialog("close");
                        },
                        "No": function() {
                            $(this).dialog("close");
                        }
                    }
                });
            };

            this.onError = function(error, reason) {
                alert("Error");
                alert(error);
                alert(reason);
            };
        }

        return StatsManager;
    }
);
