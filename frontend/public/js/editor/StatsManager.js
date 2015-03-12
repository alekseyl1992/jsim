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
                var $dialog = $("#simulation-error-dialog")
                var $details = $dialog.find(".details");
                $details.text(error);

                $dialog.dialog({
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
                        "OK": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
        });

        return StatsManager;
    }
);
