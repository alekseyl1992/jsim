var mongoose = require('mongoose');

var simulationLogSchema = new mongoose.Schema({
    modelId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['started', 'finished', 'error']
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