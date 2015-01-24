var _ = require('lodash');


var tasks = 'tasks';
var status = 'status';

var open = require('amqplib').connect('amqp://localhost');

// Consumer
open.then(function (conn) {
    var ok = conn.createChannel();
    ok = ok.then(function (ch) {
        ch.assertQueue(tasks);

        ch.consume(tasks, function (msg) {
            if (msg !== null) {
                console.log(msg.content.toString());
                ch.ack(msg);
            }
        });
    });
    return ok;
}).then(null, console.warn);

// Publisher for status
open.then(function(conn) {
    var ok = conn.createChannel();
    ok = ok.then(function(ch) {
        ch.assertQueue(tasks);

        setInterval(function() {
            ch.sendToQueue(status, new Buffer("status"));
            console.log("status sent");
        }, 1000);
    });
    return ok;
}).then(null, console.warn);