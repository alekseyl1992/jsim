define([
        'lodash',
        'easeljs',
        'editor/KeyCoder',
        'editor/objects/Source',
        'editor/objects/Queue',
        'editor/objects/Splitter',
        'editor/objects/Sink',
        'editor/Palette'
    ],
    function(_, easeljs, KeyCoder, Source, Queue, Splitter, Sink, Palette) {
        function Editor(windows) {
            var self = this;

            this.FPS = 30;

            this.windows = windows;
            this.stage = new easeljs.Stage(windows.$canvas[0]);

            this.ticker = easeljs.Ticker;

            //this.keyCoder = new KeyCoder(windows.$canvas[0]);

            this.run = function() {
                this.ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
                this.ticker.setFPS(this.FPS);
                this.ticker.on("tick", function (event) {
                    _.extend(event, self.keyCoder.getKeys());
                    self.update(event);
                });
            };

            this.testDraw = function() {
                var style = {
                    colors: {
                        contour: "black",
                        gradient: ["#AFA", "#6A6"],
                        connectionPointFill: "white"
                    },
                    sizes: {
                        w: 160,
                        h: 80,
                        bw: 140,
                        contourBold: 4,
                        textOffset: 10,
                        connectionPointRadius: 3,
                        outputsDelta: 32
                    },
                    labelFont: "bold 18px Arial"
                };

                var palette = new Palette(this.stage, style, {
                    colors: {
                        contour: "black",
                        gradient: ["#EEE", "#BBB"]
                    },
                    sizes: {
                        x: 10,
                        y: 10,
                        objectOffset: 10,
                        paletteOffset: 10
                    },
                    labelFont: "bold 18px Arial"
                });

                var dx = 200;

                var source = new Source(this.stage, style, {x: 10 + dx, y: 10, text: "Source 1"});
                var queue = new Queue(this.stage, style, {x: 220 + dx, y: 10, text: "Queue 1"});
                var splitter = new Splitter(this.stage, style, {x: 430 + dx, y: 10, text: "Splitter 1"});
                var sink = new Sink(this.stage, style, {x: 640 + dx, y: 10, text: "Sink 1"});

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
