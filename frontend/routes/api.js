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

// TODO: get report from DB
router.get('/getReport', function(req, res, next) {
    var taskId = req.query.taskId;
    console.log("/getReport: " + taskId);

    var task = taskManager.getTask(taskId);

    if (task) {
        res.json({
            reportSummary: {
                modelName: task.model.name,
                author: "Vasja Pupkin",
                simulationDate: Date.now()
            },
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

router.get('/getModel', function(req, res, next) {
    var modelName = req.query.modelName;
    console.log("/getModel: " + modelName);

    res.json({
        "name": "Model 1",
        "duration": 1000,
        "objects": [
            {
                "type": "source",
                "name": "Source 1",
                "x": 210,
                "y": 80,
                "id": "1",
                "to": "2",
                "spec": {
                    "lambda": 1
                }
            },
            {
                "type": "queue",
                "name": "Queue 1",
                "x": 420,
                "y": 80,
                "id": "2",
                "to": "3",
                "spec": {
                    "mu": 1,
                    "channels": 10,
                    "limit": -1
                }
            },
            {
                "type": "splitter",
                "name": "Splitter 1",
                "x": 630,
                "y": 80,
                "id": "3",
                "toA": "2",
                "toB": "4",
                "spec": {
                    "pA": 0.5
                }
            },
            {
                "type": "sink",
                "name": "Sink 1",
                "x": 840,
                "y": 80,
                "id": "4",
                "spec": {}
            }
        ]
    });
});

module.exports = router;
