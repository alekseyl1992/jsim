var mongoose = require('mongoose');

var session = new mongoose.Schema({
    session: String,
    expires: Date
});

// please note, that this model is created only for code-documentation purposes
// and is not required for sessions to be saved in db
// see connect-mongo library for details
mongoose.model('session', session);