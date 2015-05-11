
//app entry point
//load libs first to set baseUrl
require(['config'], function() {
    require(['jquery', 'jquery-ui', 'jquery.layout', 'editor/Editor', 'api/Client'],
        function(_1, _2, _3, Editor, Client) {
            $(function() {
                initLayout(resize);

                var $window = $(window);
                var $canvas = $('#editor-field');
                var $canvasWrapper = $('#canvas-wrapper');

                var client = new Client();

                var editor = new Editor({
                    $canvas: $canvas,
                    $modelProps: $('#model-props'),
                    $objectProps: $('#object-props'),
                    $progress: $('#simulation-progress'),
                    $progressLabel: $('#simulation-progress-label')
                }, client);


                $('#open-model').click(editor.onChooseModel.bind(editor));
                $('#save-model').click(editor.saveModel.bind(editor));
                $('#create-model').click(editor.onCreateModel.bind(editor));

                // for keyup/keydown to work
                $canvas.click(function() {
                    $canvas.focus();
                });

                var ctx = $canvas[0].getContext("2d");
                function resize() {
                    ctx.canvas.width = $canvasWrapper.width();
                    ctx.canvas.height = $canvasWrapper.height();
                    editor.resize(ctx.canvas.width, ctx.canvas.height);
                }

                $window.resize(resize);
                $window.resize();
            });
        }
    );
});

function initLayout(onResize) {
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
            onresize: onResize
        },

        east: {
            size: 230,
            childOptions: {
                minSize: 110,
                north: {
                    size: 140
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