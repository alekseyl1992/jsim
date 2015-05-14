var _ = require('lodash');
var mongoose = require('mongoose');
var loggerEnums = require('./LoggerEnums');
var simulationLog = mongoose.model('simulationLog');
var accessLog = mongoose.model('errorLog');
var errorLog = mongoose.model('errorLog');


var onFinished = require('on-finished');

module.exports = {
    /**
     *
     * @param modelId {mongoose.Schema.ObjectId}
     * @param userId {mongoose.Schema.ObjectId}
     * @param status {String} @see Logger.simulationStatus
     * @param message {String}
     */
    simulation: function(modelId, userId, status, message) {
        simulationLog.create({
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
    access: function(ip, method, url, statusCode, time, dataSize) {
        accessLog.create({
            ip: ip,
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
        errorLog.create({
            subsystem: subsystem,
            level: level,
            message: message
        });
    },

    // attention: this function relies on morgan to be enabled
    express: function(req, res, next) {
        onFinished(res, function () {
            var entry = {
                ip: (function () {
                    var ip = req.ip
                        || req._remoteAddress
                        || (req.connection && req.connection.remoteAddress)
                        || undefined;
                    if (ip) {
                        var fullIp = ip.split(':');
                        return fullIp[fullIp.length - 1];
                    } else {
                        return '';
                    }
                })(),
                method: req.method,
                url: req.originalUrl || req.url,
                statusCode: res._header ? res.statusCode : null,
                time: (function () {
                    if (!res._header || !req._startAt) return -1;
                    var diff = process.hrtime(req._startAt);
                    var ms = diff[0] * 1e3 + diff[1] * 1e-6;
                    return ms;
                })(),
                dataSize: parseInt(res._headers['content-length'])
            };

            module.exports.access.apply(module.exports, _.values(entry));
        });
        next();
    }
};
module.exports = _.merge(module.exports, loggerEnums);