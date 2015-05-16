var express = require('express');
var _ = require('lodash');
var TaskManager = require('./tasks/TaskManager');
var Task = require('./tasks/Task');

var router = express.Router();
var taskManager = new TaskManager();

// mongodb models
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model('user');
var Model = mongoose.model('model');
var Report = mongoose.model('report');

var logger = require('./util/Logger');
var loggerEnums = require('./util/LoggerEnums');


router.post('/simulate', function(req, res, next) {
    var model = req.body.model;
    var userId = req.user.id;

    console.log("/simulate: ", model);

    // model could be either (id, data) or just data
    var task = taskManager.createTask(model.data || model, model.id, userId);

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
            stats: task.stats,
            error: task.error
        });
    } else {
        logger.error(loggerEnums.subsystem.tasks,
            loggerEnums.errorLevel.critical,
            "No such task: " + taskId
        );

        //TODO: implement sendError() and underlying protocol package format
        res.json({
            taskId: taskId,
            status: Task.Status.ERROR
        });
    }
});

router.get('/getReport', function(req, res, next) {
    var taskId = req.query.taskId;
    console.log("/getReport: " + taskId);

    Report.findOne({ taskId: taskId })
        .populate('reportSummary.userId', 'username')
        .exec(function (err, report) {
            if (err) {
                //TODO: implement sendError() and underlying protocol package format
                res.json({
                    taskId: taskId,
                    status: Task.Status.ERROR
                });

                console.error("MongoDB error: ", err);
                logger.error(loggerEnums.subsystem.db,
                    loggerEnums.errorLevel.critical,
                    err
                );

                res.json(null);
            }

            res.json(report);
        }
    );
});

router.get('/getModel', function(req, res, next) {
    var modelId = req.query.modelId;
    console.log("/getModel: " + modelId);

    //TODO: check user is owner of model
    Model.findById(modelId, function (err, model) {
        if (err) {
            console.error("MongoDB error: ", err);
            logger.error(loggerEnums.subsystem.db,
                loggerEnums.errorLevel.critical,
                err
            );

            res.json(null);
            return;
        }

        res.json(model);
    });
});

router.get('/getModelList', function(req, res, next) {
    console.log("/getModelList");

    var userId = new ObjectId(req.user.id);
    var filter = {authorId: userId};
    if (req.user.isAdmin) {
        filter = {};
    }

    Model.find(filter)
        .populate('authorId', 'username')
        .exec(function (err, models) {
            if (err) {
                console.error("MongoDB error: ", err);
                logger.error(loggerEnums.subsystem.db,
                    loggerEnums.errorLevel.critical,
                    err
                );

                res.json(null);
                return;
            }

            res.json(models);
        });
});

router.post('/saveModel', function(req, res, next) {
    var model = req.body;
    console.log("/saveModel");

    var id = model._id;
    delete model._id;  // or mongo will try to save id as String

    Model.update(id, model, function (err) {
        if (err) {
            console.error("MongoDB error: ", err);
            logger.error(loggerEnums.subsystem.db,
                loggerEnums.errorLevel.critical,
                err
            );

            res.json(null);
            return;
        }

        //TODO: protocols, protocols, protocols...
        res.json({status: 'ok'});
    });
});

router.post('/createModel', function(req, res, next) {
    var data = req.body;
    console.log("/onCreateModel");

    var model = {
        authorId: req.user.id,
        data: data
    };

    Model.create(model, function (err, model) {
        if (err) {
            console.error("MongoDB error: ", err);
            logger.error(loggerEnums.subsystem.db,
                        loggerEnums.errorLevel.critical,
                        err
            );

            res.json(null);
            return;
        }

        //TODO: protocols, protocols, protocols...
        res.json(model);
    });
});

router.post('/removeModel', function(req, res, next) {
    console.log("/removeModel");

    var modelId = new ObjectId(req.body.modelId);
    Model.remove({_id: modelId}, function (err) {
        if (err) {
            console.error("MongoDB error: ", err);
            logger.error(loggerEnums.subsystem.db,
                loggerEnums.errorLevel.critical,
                err
            );

            res.json(null);
            return;
        }

        //TODO: protocols, protocols, protocols...
        res.json({status: 'ok'});
    });
});

module.exports = router;
