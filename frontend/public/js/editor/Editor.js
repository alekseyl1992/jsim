define(['lodash', 'easeljs', 'editor/KeyCoder'],
    function(_, easeljs, KeyCoder) {
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
                var colors = {
                    contour: "black",
                    gradient: ["#AFA", "#6A6"]
                };

                var sizes = {
                    w: 200,
                    h: 100,
                    bw: 160,
                    contourBold: 4
                };


                var source = this.drawSource(colors, sizes);
                source.x = 10;
                source.y = 10;

                this.stage.addChild(source);

                var splitter = this.drawSplitter(colors, sizes);
                splitter.x = 10;
                splitter.y = 120;

                this.stage.addChild(splitter);

                var queue = this.drawQueue(colors, sizes);
                queue.x = 10;
                queue.y = 230;

                this.stage.addChild(queue);

                var sink = this.drawSink(colors, sizes);
                sink.x = 10;
                sink.y = 340;

                this.stage.addChild(sink);

                _.each([source, queue, splitter, sink], function(obj) {
                    obj.on("pressmove", function(evt) {
                        evt.target.x = evt.stageX;
                        evt.target.y = evt.stageY;
                        this.stage.update();
                    });
                });

                this.stage.update();
            };

            this.drawSource = function(colors, sizes) {
                var shape = new easeljs.Shape();
                var gfx = shape.graphics;
                var s = sizes;

                gfx.beginStroke(colors.contour)
                    .beginLinearGradientFill(colors.gradient,
                    [0, 1], 0, 0, 0, s.h)
                    .moveTo(0, 0)
                    .lineTo(s.bw, 0)
                    .lineTo(s.w, s.h / 2)
                    .lineTo(s.bw, s.h)
                    .lineTo(0, s.h)
                    .closePath();

                return shape;
            };

            this.drawSplitter = function(colors, sizes) {
                var shape = new easeljs.Shape();
                var gfx = shape.graphics;
                var s = sizes;

                gfx.beginStroke(colors.contour)
                    .beginLinearGradientFill(colors.gradient,
                    [0, 1], 0, 0, 0, s.h)
                    .moveTo(s.w - s.bw, 0)
                    .lineTo(s.w, 0)
                    .lineTo(s.w, s.h)
                    .lineTo(s.w - s.bw, s.h)
                    .lineTo(0, s.h / 2)
                    .closePath();

                return shape;
            };

            this.drawQueue = function(colors, sizes) {
                var shape = new easeljs.Shape();
                var gfx = shape.graphics;
                var s = sizes;

                gfx.beginStroke(colors.contour)
                    .beginLinearGradientFill(colors.gradient,
                    [0, 1], 0, 0, 0, s.h)
                    .drawRect(0, 0, s.w, s.h);

                return shape;
            };

            this.drawSink = function(colors, sizes) {
                var shape = new easeljs.Shape();
                var gfx = shape.graphics;
                var s = sizes;

                // rect
                gfx.beginStroke(colors.contour)
                    .beginLinearGradientFill(colors.gradient,
                    [0, 1], 0, 0, 0, s.h)
                    .drawRect(0, 0, s.bw, s.h)
                    .endStroke();


                var drawCircle = function(color, lineWidth) {
                    // circle
                    gfx.beginStroke(color)
                        .setStrokeStyle(lineWidth)
                        .drawCircle(s.bw, s.h / 2, s.h / 2)
                        .endStroke()
                        .endFill();

                    var r = s.h / 2;
                    var delta = r * Math.sqrt(2) / 2;

                    // line \
                    gfx.beginStroke(color)
                        .setStrokeStyle(lineWidth)
                        .moveTo(s.bw - delta, r - delta)
                        .lineTo(s.bw + delta, r + delta);

                    // line /
                    gfx.beginStroke(color)
                        .setStrokeStyle(lineWidth)
                        .moveTo(s.bw - delta, r + delta)
                        .lineTo(s.bw + delta, r - delta);
                };

                drawCircle(colors.contour, s.contourBold);
                drawCircle(colors.gradient[0], s.contourBold / 2);

                return shape;
            };

            this.testDraw();
        }

        return Editor;
    }
);
