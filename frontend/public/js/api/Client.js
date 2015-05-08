define(['jquery', 'api/Exceptions'], function($, Exceptions) {
    var Client = Class.create({
        /**
         * Sends model to the frontend server
         * @param model {String}
         * @param callbacks {Object}
         * @param callbacks.onError {Function}
         * @param callbacks.onProgress {Function}
         * @param callbacks.onComplete {Function}
         */
        sendModel: function(model, callbacks) {
            var self = this;

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
        },

        pollProgress: function (taskId, callbacks) {
            var self = this;

            this._get("/api/getProgress", {
                taskId: taskId
            }, {
                onError: function (error) {
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
                    } else if(msg.status == 'error') {
                        callbacks.onError(msg.error, Exceptions.MODELLING);
                    } else {
                        setTimeout(self.pollProgress.bind(self, taskId, callbacks), 500);
                    }
                }
            });
        },

        /**
         * Gets JSON stats report
         * @param taskId {String}
         * @param callbacks {Object}
         * @param callbacks.onError {Function}
         * @param callbacks.onComplete {Function}
         */
        getReport: function(taskId, callbacks) {
            this._get("/api/getReport", {
                taskId: taskId
            }, callbacks);
        },

        //TODO: define callbacks documentation somewhere in one place
        /**
         * Gets JSON stats report
         * @param modelId {String}
         * @param callbacks {Object}
         * @param callbacks.onError {Function}
         * @param callbacks.onComplete {Function}
         */
        getModel: function(modelId, callbacks) {
            this._get("/api/getModel", {
                modelId: modelId
            }, callbacks);
        },

        getModelList: function (callbacks) {
            this._get("/api/getModelList", null, callbacks);
        },

        saveModel: function(model, callbacks) {
            this._post("/api/saveModel", model, callbacks);
        },

        createModel: function(data, callbacks) {
            this._post("/api/createModel", data, callbacks);
        },

        _get: function(url, data, callbacks) {
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
        },

        _post: function (url, data, callbacks) {
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
        },
    });

    return Client;
});

