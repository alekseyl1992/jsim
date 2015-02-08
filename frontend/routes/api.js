var express = require('express');
var _ = require('lodash');
var TaskManager = require('./tasks/TaskManager');
var Task = require('./tasks/Task');

var router = express.Router();
var taskManager = new TaskManager();

router.post('/simulate', function(req, res, next) {
    var model = req.body.model;
    console.log("/simulate: ", model);

    var task = taskManager.createTask(model);

    res.json({
        taskId: task.id,
        status: task.status
    });
});

router.get('/getProgress', function(req, res, next) {
    var taskId = req.query.taskId;
    console.log("/getProgress: " + taskId);

    var task = taskManager.getTask(taskId);

    if (task) {
        res.json({
            taskId: task.id,
            status: task.status,
            progress: task.progress,
            stats: task.stats
        });
    } else {
        //TODO: implement sendError() and underlying protocol package format
        res.json({
            taskId: taskId,
            status: Task.Status.ERROR
        });
    }
});

module.exports = router;
