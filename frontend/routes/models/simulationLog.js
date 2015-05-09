var mongoose = require('mongoose');
var logger = require('util/Logger');

var simulationLogSchema = new mongoose.Schema({
    modelId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Logger.simulationStatus
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

mongoose.model('accessLog', simulationLogSchema);