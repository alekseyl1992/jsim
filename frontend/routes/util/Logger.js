'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var loggerEnums = require('./LoggerEnums');
var simulationLog = mongoose.model('simulationLog');
var accessLog = mongoose.model('errorLog');
var errorLog = mongoose.model('errorLog');
var onFinished = require('on-finished');

class Logger {
    /**
     *
     * @param modelId {mongoose.Schema.ObjectId}
     * @param userId {mongoose.Schema.ObjectId}
     * @param status {String} @see Logger.simulationStatus
     * @param message {String}
     * @param taskId {String}
     */
    simulation(modelId, userId, status, message, taskId) {
        simulationLog.create({
            modelId: modelId,
            userId: userId,
            status: status,
            message: message,
            taskId: taskId
        });
    }

    /**
     *
     * @param ip {String}
     * @param method {String}
     * @param url {String}
     * @param statusCode {Number}
     * @param time {Number}
     * @param dataSize {Number}
     */
    access(ip, method, url, statusCode, time, dataSize) {
        // log errors to errorLog
        if (statusCode != 200 && statusCode != 302) {
            var level = loggerEnums.errorLevel.warn;
            if (statusCode == 500)
                level = loggerEnums.errorLevel.critical;

            this.error(loggerEnums.subsystem.http,
                loggerEnums.errorLevel.warn,
                JSON.stringify(arguments)
            );
        }

        // log access
        accessLog.create({
            ip: ip,
            method: method,
            url: url,
            statusCode: statusCode,
            time: time,
            dataSize: dataSize
        });
    }

    /**
     *
     * @param subsystem {String} @see subsystem
     * @param level {String} @see errorLevel
     * @param message {String}
     */
    error(subsystem, level, message) {
        errorLog.create({
            subsystem: subsystem,
            level: level,
            message: message
        });
    }

    // attention: this function relies on morgan to be enabled
    express(req, res, next) {
        var self = this;

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

            self.access.apply(self, _.values(entry));
        });
        next();
    }
}

module.exports = new Logger();