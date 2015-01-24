var _ = require('lodash');


var tasks = 'tasks';
var status = 'status';

var open = require('amqplib').connect('amqp://localhost');

var i = 0;

// Publisher for tasks
open.then(function(conn) {
    var ok = conn.createChannel();
    ok = ok.then(function(ch) {
        ch.assertQueue(tasks);

        setInterval(function() {
            ch.sendToQueue(tasks, new Buffer("something to do: " + i));
            console.log("Sent: " + i);
            ++i;
        }, 10000);
});
return ok;
}).then(null, console.warn);

// Consumer for status
open.then(function (conn) {
    var ok = conn.createChannel();
    ok = ok.then(function (ch) {
        ch.assertQueue(status);

        ch.consume(status, function (msg) {
            if (msg !== null) {
                console.log(msg.content.toString());
                ch.ack(msg);
            }
        });
    });
    return ok;
}).then(null, console.warn);