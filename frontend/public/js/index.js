
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'jquery.layout', 'editor/Editor', 'api/Client', 'editor/StatsManager'],
        function(_1, _2, _3, Editor, Client, StatsManager) {
            $(function() {
                initLayout();

                var $window = $(window);
                var $canvas = $('#editor-field');
                var $canvasWrapper = $('#canvas-wrapper');

                var statsManager = new StatsManager({
                    $progress: $('#simulation-progress'),
                    $progressLabel: $('#simulation-progress-label')
                });

                var client = new Client();

                var editor = new Editor({
                    $canvas: $canvas,
                    $modelProps: $('#model-props'),
                    $objectProps: $('#object-props')
                }, client, statsManager);

                // for keyup/keydown to work
                $canvas.click(function() {
                    $canvas.focus();
                });

                //TODO: add canvas's parent resize handler
                var ctx = $canvas[0].getContext("2d");
                $window.resize(function() {
                    ctx.canvas.width = $canvasWrapper.width();
                    ctx.canvas.height = $canvasWrapper.height();
                    editor.resize(ctx.canvas.width, ctx.canvas.height);
                });
                $window.resize();
            });
        }
    );
});

function initLayout() {
    var $body = $('body');

    $body.layout({
        //stateManagement: {
        //    enabled: true
        //},

        defaults: {
            resizable: false,
            closable: false
        },
        north: {
            size: 50
        },

        center: {
            resizable: false,
        },

        east: {
            size: 200,
            childOptions: {
                minSize: 110,
                north: {
                    size: 110
                }
            }
        },

        south: {
            closable: true,
            slidable: true
        }
    });

    $body.css('visibility', 'visible');
}