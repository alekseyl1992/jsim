var express = require('express');
var _ = require('lodash');
var TaskManager = require('./tasks/TaskManager');
var Task = require('./tasks/Task');

var router = express.Router();
var taskManager = new TaskManager();

// mongodb models
var mongoose = require('mongoose');

var User = mongoose.model('user');
var Model = mongoose.model('model');


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
    var modelId = req.query.modelId;
    console.log("/getModel: " + modelId);

    //TODO: check user is owner of model
    Model.findById(modelId, function (err, model) {
        if (err)
            return console.error("MongoDB error: ", err);

        res.json(model);
    });
});

router.get('/getModelList', function(req, res, next) {
    console.log("/getModelList");

    var userId = req.user.id;
    Model.find({author_id: userId}, function (err, models) {
        if (err)
            return console.error("MongoDB error: ", err);

        res.json(models);
    });
});

router.get('/saveModel', function(req, res, next) {
    var model = req.query.model;
    console.log("/saveModel");

    Model.update(model._id, model, function (err) {
        if (err)
            return console.error("MongoDB error: ", err);

        //TODO: protocols, protocols, protocols...
        res.json({status: 'ok'});
    });
});

router.get('/createModel', function(req, res, next) {
    var data = req.query.data;
    console.log("/createModel");

    var model = {
        author_id: req.user.id,
        data: data
    };

    Model.create(model, function (err, model) {
        if (err)
            return console.error("MongoDB error: ", err);

        //TODO: protocols, protocols, protocols...
        res.json(model);
    });
});

module.exports = router;
