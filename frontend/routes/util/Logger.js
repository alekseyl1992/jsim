var mongoose = require('mongoose');
var simulationLog = mongoose.model('simulationLog');
var accessLog = mongoose.model('accessLog');
var errorLog = mongoose.model('errorLog');

module.exports = {
    simulationStatus: {
        started: 'started',
        finished: 'finished',
        error: 'error'
    },

    subsystem: {
        http: 'http',
        db: 'db',
        rmq: 'rmq',
        server: 'server'
    },

    errorLevel: {
        warn: 'warn',
        error: 'error',
        critical: 'critical'
    },

    /**
     *
     * @param modelId {mongoose.Schema.ObjectId}
     * @param userId {mongoose.Schema.ObjectId}
     * @param status {String} @see Logger.simulationStatus
     * @param message {String}
     */
    simulation: function(modelId, userId, status, message) {
        simulationLog.insert({
            modelId: modelId,
            userId: userId,
            status: status,
            message: message
        });
    },

    /**
     *
     * @param method {String}
     * @param url {String}
     * @param statusCode {Number}
     * @param time {Number}
     * @param dataSize {Number}
     */
    access: function(method, url, statusCode, time, dataSize) {
        accessLog.insert({
            method: method,
            url: url,
            statusCode: statusCode,
            time: time,
            dataSize: dataSize
        });
    },

    /**
     *
     * @param subsystem {String} @see subsystem
     * @param level {String} @see errorLevel
     * @param message {String}
     */
    error: function(subsystem, level, message) {
        errorLog.insert({
            subsystem: subsystem,
            level: level,
            message: message
        });
    }
};