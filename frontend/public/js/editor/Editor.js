define([
        'lodash',
        'easeljs',
        'editor/KeyCoder',
        'editor/objects/Source',
        'editor/objects/Queue',
        'editor/objects/Splitter',
        'editor/objects/Sink',
        'editor/Palette',
        'editor/Styles',
        'editor/Model',
        'editor/Connector'
    ],
    function(_, easeljs, KeyCoder, Source, Queue, Splitter, Sink, Palette, Styles, Model, Connector) {
        function Editor(windows) {
            var self = this;

            this.FPS = 30;

            this.windows = windows;
            this.stage = new easeljs.Stage(windows.$canvas[0]);

            //this.ticker = easeljs.Ticker;
            //
            //this.keyCoder = new KeyCoder(windows.$canvas[0]);
            //
            //this.run = function() {
            //    this.ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
            //    this.ticker.setFPS(this.FPS);
            //    this.ticker.on("tick", function (event) {
            //        _.extend(event, self.keyCoder.getKeys());
            //        self.update(event);
            //    });
            //};

            var model = new Model(this.stage);
            var connector = new Connector(this.stage);

            this.testDraw = function() {
                var objectStyle = Styles.object;
                var palette = new Palette(this.stage, objectStyle, Styles.palette);

                var dx = 200;

                var source = new Source(this.stage, objectStyle, {x: 10 + dx, y: 10, name: "Source 1"});
                var queue = new Queue(this.stage, objectStyle, {x: 220 + dx, y: 10, name: "Queue 1"});
                var splitter = new Splitter(this.stage, objectStyle, {x: 430 + dx, y: 10, name: "Splitter 1"});
                var sink = new Sink(this.stage, objectStyle, {x: 640 + dx, y: 10, name: "Sink 1"});

                this.stage.update();
            };

            this.resize = function(w, h) {
                this.stage.update();
            };

            this.testDraw();
        }

        return Editor;
    }
);
