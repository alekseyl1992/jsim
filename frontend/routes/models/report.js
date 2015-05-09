var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
    taskId: {
        type: String,
        unique: true
    },
    reportSummary: {
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        },
        model: JSON,
        simulationDate: {
            type: Date,
            default: Date.now
        }
    },
    stats: JSON
});

mongoose.model('report', reportSchema);