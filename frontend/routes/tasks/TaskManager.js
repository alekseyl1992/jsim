var _ = require('lodash');

var Task = require('./Task');
var RmqFacade = require('./RmqFacade');

var Report = require('mongoose').model('report');

function TaskManager() {
    var rmq = new RmqFacade(this);
    rmq.start();

    var tasks = {};

    this.createTask = function (model, userId) {
        var task = new Task(model, userId);
        tasks[task.id] = task;

        rmq.sendTask(task);

        task.status = Task.Status.SENT;

        console.log("[TM] createTask: ", task);

        return task;
    };

    this.getTask = function (taskId) {
        return tasks[taskId];
    };

    this.onProgress = function (msg) {
        var task = tasks[msg.taskId];
        if (!task) {
            console.warn("Task does not exist: " + msg.taskId);
            return;
        }

        if (task.status != Task.Status.DONE) {
            task.status = Task.Status.IN_PROGRESS;
            task.progress = msg.progress;

            console.log("[TM] onProgress: ", task);
        }
    };

    this.onError = function (msg) {
        var task = tasks[msg.taskId];
        if (!task) {
            console.warn("Task does not exist: " + msg.taskId);
            return;
        }

        task.status = Task.Status.ERROR;
        task.error = msg.message;

        console.log("[TM] onError: ", task);
    };

    this.onFinished = function (msg) {
        var task = tasks[msg.taskId];
        if (!task) {
            console.warn("Task does not exist: " + msg.taskId);
            return;
        }

        task.status = Task.Status.DONE;
        task.stats = this.mergeStats(msg.stats);

        // save report to DB
        Report.create({
            _id: msg.taskId,
            reportSummary: {
                model: model,
                userId: task.userId
            },
            stats: task.stats
        });

        console.log("[TM] onFinished: ", task);
    };

    this.mergeStats = function (statsArray) {
        var self = this;

        if (statsArray.length == 1)
            return statsArray[0];

        var result =  {};
        _.reduce(statsArray, function (result, stats) {
            self._mergeStats(result, stats, statsArray.length);

            return result;
        }, result);

        return result;
    };

    /**
     * Recursive merge of two objects
     * Averages all Numbers from source
     * @param target {Object} Merge target
     * @param source {Object} Object to merge in target
     * @param denominator {Number} Denominator for averaging
     * @private
     */
    this._mergeStats = function (target, source, denominator) {
        var self = this;

        _.forOwn(source, function (value, key) {
            if (_.isNumber(value)) {
                if (_.isUndefined(target[key]))
                    target[key] = value / denominator;
                else
                    target[key] += value / denominator;
            } else if (_.isObject(value) || _.isArray(value)) {
                if (_.isUndefined(target[key])) {
                    if (_.isArray(value))
                        target[key] = [];
                    else
                        target[key] = {};
                }

                self._mergeStats(target[key], source[key], denominator);
            } else {  // other primitive types (String, etc)
                target[key] = value;
            }
        });
    };
}

module.exports = TaskManager;