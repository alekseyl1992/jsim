
$(function() {
    var $input = $('#input');
    var $output = $('#output');
    var $send = $('#send');
    var $progress = $('#progress');

    $send.click(function () {
        sendModel($input.val());
        return false;
    });

    // functions:

    function sendModel(model) {
        console.log("Sending model: ", model);

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/api/simulate",
            dataType: "json",
            data: JSON.stringify({
                model: JSON.parse(model)
            })
        })
            .done(function(msg) {
                console.log("Message received: ", msg);
                console.log("Task id: " + msg.taskId);

                pollProgress(msg.taskId);
            })
            .fail(function(error) {
                alert("Error while trying to simulate model");
                console.log(error);
                $('body').html(error.responseText);
            });
    }

    function pollProgress(taskId) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/api/getProgress",
            data: {
                taskId: taskId
            }
        })
            .done(function(msg) {
                console.log("Message received: ", msg);
                console.log("Progress: " + msg.progress);

                $progress.val(msg.progress * 100);

                if (msg.status == "done") {
                    $progress.val(100);
                    console.log("Stats: ", msg.stats);

                    $output.val(JSON.stringify(msg));

                    alert("Simulation finished!");
                } else {
                    setTimeout(pollProgress.bind(this, taskId), 500);
                }
            })
            .fail(function(error) {
                setTimeout(pollProgress.bind(this, taskId), 500);
                alert("Error while trying to poll progress");
            });
    }
});

