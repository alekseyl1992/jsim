var _ = require('lodash');
var mongoose = require('mongoose');
var LoggerEnums = require('../util/LoggerEnums');

var errorLog = new mongoose.Schema({
    subsystem: {
        type: String,
        enum: _.keys(LoggerEnums.subsystem)
    },
    level: {
        type: String,
        enum: _.keys(LoggerEnums.errorLevel)
    },
    message: String,
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('errorLog', errorLog);