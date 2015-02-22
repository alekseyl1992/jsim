var mongoose = require('mongoose');

var ModelSchema = new mongoose.Schema({
    author_id: {
        type: String,
        unique: true,
        required: true
    },
    data: {
        type: JSON,
        required: true
    }
});

mongoose.model('model', ModelSchema);