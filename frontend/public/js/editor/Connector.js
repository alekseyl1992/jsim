define([], function() {
    function Connector(stage) {
        var self = this;

        this.stage = stage;

        var from = null;
        var to = null;

        this.setFrom = function(fromObject, output) {
            this.from = {
                object: fromObject,
                output: output
            }
        };

        this.setTo = function(toObject, input) {
            this.to = {
                object: toObject,
                input: input
            };
        };

        this.createConnection = function() {

        };
    }

    return Connector;
});