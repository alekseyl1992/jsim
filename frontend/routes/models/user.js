var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    dateRegistered: {
        type: Date,
        'default': Date.now
    },
    isAdmin: {
        type: Boolean,
        'default': false
    }
});

mongoose.model('user', userSchema);