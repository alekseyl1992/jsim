var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
    reportSummary: {
        author: {
            type: String,
            unique: true,
            required: true
        },
        modelName: {
            type: String,
            unique: false,
            required: true
        },
        simulationDate: {
            type: Date,
            default: Date.now
        }
    },
    stats: JSON
});

mongoose.model('report', reportSchema);