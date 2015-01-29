
//app entry point
//load libs first to set baseUrl
require(['libs'], function() {
    require(['jquery', 'jquery-ui', 'jquery.layout', 'editor/Editor'],
        function(_1, _2, _3, Editor) {
            $(function() {
                initLayout();

                //add canvas resize handler


                var $window = $(window);
                var $canvas = $('#editor-field');
                var $canvasWrapper = $('#canvas-wrapper');

                var ctx = $canvas[0].getContext("2d");
                $window.resize(function() {
                    ctx.canvas.width = $canvasWrapper.width();
                    ctx.canvas.height = $canvasWrapper.height();
                });
                $window.resize();

                var editor = new Editor({
                    $canvas: $canvas,
                    $modelProps: $('#model-props'),
                    $objectProps: $('#object-props')
            });
        });
    });
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
                minSize: 50,
                north: {
                    size: 100
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