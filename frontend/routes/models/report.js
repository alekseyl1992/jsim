var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
    reportSummary: {
        userId: mongoose.Schema.ObjectId,
        model: JSON,
        simulationDate: {
            type: Date,
            default: Date.now
        }
    },
    stats: JSON
});

mongoose.model('report', reportSchema);