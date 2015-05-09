var mongoose = require('mongoose');
var logger = require('util/Logger');

var accessLog = new mongoose.Schema({
    subsystem: {
        type: String,
        enum: Logger.subsystem
    },
    level: {
        type: String,
        enum: Logger.errorLevel
    },
    message: String,
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('accessLog', accessLog);