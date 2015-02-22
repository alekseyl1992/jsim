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

            this._post("/api/simulate", {
                model: model
            }, {
                onError: function (error) {
                    alert("Error while trying to simulate model");
                    console.log(error);
                    callbacks.onError(error, Exceptions.SENDING);
                },
                onComplete: function (msg) {
                    console.log("Message received: ", msg);
                    console.log("Task id: " + msg.taskId);

                    self.pollProgress(msg.taskId, callbacks);
                }
            });
        };

        this.pollProgress = function(taskId, callbacks) {
            this._get("/api/getProgress", {
                taskId: taskId
            }, {
                onError: function (error) {
                    setTimeout(self.pollProgress.bind(self, taskId), 500);
                    alert("Error while trying to poll progress");
                    callbacks.onError(error, Exceptions.POLLING);
                },
                onComplete: function (msg) {
                    console.log("Message received: ", msg);
                    console.log("Progress: " + msg.progress);

                    callbacks.onProgress(msg.progress * 100);

                    if (msg.status == "done") {
                        callbacks.onProgress(100);
                        console.log("Stats: ", msg.stats);

                        callbacks.onComplete(msg);
                    } else {
                        setTimeout(self.pollProgress.bind(self, taskId, callbacks), 500);
                    }
                }
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
            this._get("/api/getReport", {
                taskId: taskId
            }, callbacks);
        };

        //TODO: define callbacks documentation somewhere in one place
        /**
         * Gets JSON stats report
         * @param modelName {String}
         * @param callbacks {Object}
         * @param callbacks.onError {Function}
         * @param callbacks.onComplete {Function}
         */
        this.getModel = function(modelName, callbacks) {
            this._get("/api/getModel", {
                modelName: modelName
            }, callbacks);
        };

        this.getModelList = function (callbacks) {
            this._get("/api/getModel", null, callbacks);
        };

        this.saveModel = function(model, callbacks) {
            this._post("/api/saveModel", model, callbacks);
        };

        this.createModel = function(data, callbacks) {
            this._post("/api/createModel", data, callbacks);
        };

        this._get = function(url, data, callbacks) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: url,
                data: data
            })
                .done(function (msg) {
                    callbacks.onComplete(msg);
                })
                .fail(function (error) {
                    callbacks.onError(error);
                });
        };

        this._post = function (url, data, callbacks) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: url,
                dataType: "json",
                data: JSON.stringify(data)
            })
                .done(function (msg) {
                    callbacks.onComplete(msg);
                })
                .fail(function (error) {
                    callbacks.onError(error);
                });
        };
    }

    return Client;
});

