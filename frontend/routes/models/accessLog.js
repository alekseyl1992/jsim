var mongoose = require('mongoose');

var accessLog = new mongoose.Schema({
    ip: String,
    method: String,
    url: String,
    statusCode: Number,
    time: Number,
    dataSize: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('accessLog', accessLog);