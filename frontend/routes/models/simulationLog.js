var _ = require('lodash');
var mongoose = require('mongoose');
var LoggerEnums = require('../util/LoggerEnums');

var simulationLog = new mongoose.Schema({
    modelId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'model'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user'
    },
    status: {
        type: String,
        required: true,
        enum: _.keys(LoggerEnums.simulationStatus)
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('simulationLog', simulationLog);