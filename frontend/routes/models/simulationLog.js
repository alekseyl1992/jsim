var _ = require('lodash');
var mongoose = require('mongoose');
var LoggerEnums = require('../util/LoggerEnums');

var simulationLog = new mongoose.Schema({
    modelId: {
        type: mongoose.Schema.ObjectId,
        ref: 'model'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    status: {
        type: String,
        'enum': _.keys(LoggerEnums.simulationStatus)
    },
    message: String,
    date: {
        type: Date,
        'default': Date.now
    }
});

mongoose.model('simulationLog', simulationLog);