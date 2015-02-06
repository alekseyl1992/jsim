define([], function() {
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
                alert("onComplete" + stats);
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
