var Task = require('./Task');
var RmqFacade = require('./RmqFacade');

function TaskManager() {
    var rmq = new RmqFacade(this);
    rmq.start();

    var tasks = {};

    this.createTask = function(model) {
        var task = new Task(model);
        tasks[task.id] = task;

        rmq.sendTask(task);

        task.status = Task.Status.SENT;

        return task;
    };

    this.getTask = function(taskId) {
        return tasks[taskId];
    };

    this.onProgress = function(msg) {
        var task = tasks[msg.taskId];
        if (!task) {
            console.warn("Task does not exist: " + msg.taskId);
            return;
        }

        task.status = Task.Status.IN_PROGRESS;
        task.progress = msg.progress;
    };

    this.onError = function(msg) {
        var task = tasks[msg.taskId];
        if (!task) {
            console.warn("Task does not exist: " + msg.taskId);
            return;
        }

        task.status = Task.Status.ERROR;
        task.error = msg.message;
    };

    this.onFinished = function(msg) {
        var task = tasks[msg.taskId];
        if (!task) {
            console.warn("Task does not exist: " + msg.taskId);
            return;
        }

        task.status = Task.Status.DONE;
        task.stats = msg.stats;
    };
}

module.exports = TaskManager;