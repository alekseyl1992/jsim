var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({
    authorId: mongoose.Schema.ObjectId,
    data: {
        name: String,
        objects: [{
            id: String,
            name: String,
            type: {
                type: String,
                enum: ['source', 'queue', 'splitter', 'sink']
            },
            x: Number,
            y: Number,
            spec: {
                lambda: {
                    type: Number,
                    required: false
                },
                mu: {
                    type: Number,
                    required: false
                },
                channels: {
                    type: Number,
                    required: false
                },
                limit: {
                    type: Number,
                    required: false
                }
            },
            to: {
                type: String,
                required: false
            },
            toA: {
                type: String,
                required: false
            },
            toB: {
                type: String,
                required: false
            }
        }],
        duration: Number,
        runs: Number,
        dateCreated: {
            type: Date,
            default: Date.now
        }
    }
});

mongoose.model('model', modelSchema);