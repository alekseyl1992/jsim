var mongoose = require('mongoose');

var accessLog = new mongoose.Schema({
    subsystem: {
        type: String,
        enum: ['frontend', 'db', 'rmq', 'server']
    },
    level: {
        type: String,
        enum: ["warn", "error", "critical"]
    },
    message: String,
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('accessLog', accessLog);