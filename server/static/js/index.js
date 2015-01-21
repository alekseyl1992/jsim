
$(document).ready(function() {
    var $form = $("#form");
    var $wrongBlock = $('#wrong');
    var $spin = $('#spin');
    var spinner = new Spinner().spin();
    $spin.append(spinner.el);

    var toggleDelay = 100;
    var pollingPeriod = 100;

    $form.submit(function() {
        $wrongBlock.hide(toggleDelay);

        $.post($form.attr("action"), $form.serialize())
            .done(function(result) {
                console.log(result);
                if (result == "wrong") {
                    $spin.hide(toggleDelay);
                    $wrongBlock.show(toggleDelay);
                    $form.children().attr("disabled", false);
                    return false;
                }
                else {
                    $form.children().attr("disabled", true);
                    $spin.show(toggleDelay);
                    poll();
                }
            })
            .fail(function() {
                alert("Unable to reach server");
                $spin.hide(toggleDelay);
                $form.children().attr("disabled", false);
            });

        return false;
    });

    var poll = function() {
        $.get("/poll")
            .done(function(result) {
                console.log(result);

                switch(result) {
                    case "wait":
                        setTimeout(poll, pollingPeriod);
                        break;
                    case "ok":
                        $spin.hide(toggleDelay);
                        $form.children().attr("disabled", false);
                        window.location.href = "/timer";
                        break;
                    case "wrong":
                        $spin.hide(toggleDelay);
                        $wrongBlock.show(toggleDelay);
                        $form.children().attr("disabled", false);
                        break;
                    case "error":
                        $spin.hide(toggleDelay);
                        $form.children().attr("disabled", false);
                        alert("Unable to get data from database");
                        break;
                }
            })
            .fail(function() {
                setTimeout(poll, pollingPeriod);
            });
    }
});