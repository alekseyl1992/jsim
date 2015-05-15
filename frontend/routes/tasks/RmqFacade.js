var amqplib = require('amqplib');

var queues = {
    tasks: 'jsim.tasks',
    progress: 'jsim.progress',
    error: 'jsim.error',
    stats: 'jsim.stats'
};

function RmqFacade(taskManager) {
    var channel = null;

    //TODO: graceful restart

    this.start = function() {
        var open = amqplib.connect('amqp://localhost');
        open.then(function (conn) {
            console.log("Connected to RMQ");

            var ok = conn.createChannel();
            ok = ok.then(function (ch) {
                ch.assertQueue(queues.tasks);
                ch.assertQueue(queues.progress);
                ch.assertQueue(queues.error);
                ch.assertQueue(queues.stats);

                ch.consume(queues.progress, function(msg) {
                    taskManager.onProgress(JSON.parse(msg.content.toString()));
                    ch.ack(msg);
                });

                ch.consume(queues.error, function(msg) {
                    taskManager.onError(JSON.parse(msg.content.toString()));
                    ch.ack(msg);
                });

                ch.consume(queues.stats, function(msg) {
                    taskManager.onFinished(JSON.parse(msg.content.toString()));
                    ch.ack(msg);
                });

                console.log("RMQ consumers started");

                channel = ch;
            });

            return ok;
        }).then(null, console.warn);
    };

    this.sendTask = function(task) {
        channel.sendToQueue(queues.tasks, new Buffer(JSON.stringify(task)));
    };
}

module.exports = RmqFacade;