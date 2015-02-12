define(['jquery', 'api/Exceptions'], function($, Exceptions) {
    function Client() {
        var self = this;

        /**
         * Sends model to the frontend server
         * @param model {String}
         * @param callbacks {Object}
         * @param callbacks.onError {Function}
         * @param callbacks.onProgress {Function}
         * @param callbacks.onComplete {Function}
         */
        this.sendModel = function(model, callbacks) {
            console.log("Sending model: ", model);

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/api/simulate",
                dataType: "json",
                data: JSON.stringify({
                    "model": model
                })
            })
                .done(function(msg) {
                    console.log("Message received: ", msg);
                    console.log("Task id: " + msg.taskId);

                    self.pollProgress(msg.taskId, callbacks);
                })
                .fail(function(error) {
                    alert("Error while trying to simulate model");
                    console.log(error);
                    callbacks.onError(error, Exceptions.SENDING);
                });
        };

        this.pollProgress = function(taskId, callbacks) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: "/api/getProgress",
                data: {
                    taskId: taskId
                }
            })
                .done(function (msg) {
                    console.log("Message received: ", msg);
                    console.log("Progress: " + msg.progress);

                    callbacks.onProgress(msg.progress * 100);

                    if (msg.status == "done") {
                        callbacks.onProgress(100);
                        console.log("Stats: ", msg.stats);

                        callbacks.onComplete(msg);

                        alert("Simulation finished!");
                    } else {
                        setTimeout(self.pollProgress.bind(self, taskId, callbacks), 500);
                    }
                })
                .fail(function (error) {
                    setTimeout(self.pollProgress.bind(self, taskId), 500);
                    alert("Error while trying to poll progress");
                    callbacks.onError(error, Exceptions.POLLING);
                });
        };

        /**
         * Gets JSON stats report
         * @param taskId {String}
         * @param callbacks {Object}
         * @param callbacks.onError {Function}
         * @param callbacks.onComplete {Function}
         */
        this.getReport = function(taskId, callbacks) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: "/api/getReport",
                data: {
                    taskId: taskId
                }
            })
                .done(function (msg) {
                    console.log("Report: ", msg);
                    callbacks.onComplete(msg);
                })
                .fail(function (error) {
                    callbacks.onError(error);
                });
        }
    }

    return Client;
});

