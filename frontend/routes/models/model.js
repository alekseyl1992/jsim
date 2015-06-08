var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    data: {
        name: String,
        objects: [{
            id: String,
            name: String,
            type: {
                type: String,
                'enum': ['source', 'queue', 'splitter', 'sink']
            },
            x: Number,
            y: Number,
            spec: {
                lambda: Number,
                mu: Number,
                channels: Number,
                limit: Number
            },
            to: String,
            toA: String,
            toB: String
        }],
        duration: Number,
        runs: Number,
        dateCreated: {
            type: Date,
            'default': Date.now
        }
    }
});

mongoose.model('model', modelSchema);