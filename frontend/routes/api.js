var express = require('express');
var _ = require('lodash');
var TaskManager = require('./tasks/TaskManager');

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

  //TODO: if task is done, save stats to DB

  res.json({
    taskId: task.id,
    status: task.status,
    progress: task.progress,
    stats: task.stats
  });
});

module.exports = router;
