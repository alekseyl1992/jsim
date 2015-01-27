require(['lodash', 'createjs', 'app/KeyCoder'],
    function(_, createjs, KeyCoder) {
        function Editor(windows) {
            var self = this;

            this.windows = windows;
            this.stage = new createjs.Stage(
                windows.$canvas.getContext("2d"));

            this.ticker = createjs.Ticker;

            this.keyCoder = new KeyCoder(windows.$canvas);

            this.run = function () {
                this.ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
                this.ticker.setFPS(this.FPS);
                this.ticker.on("tick", function (event) {
                    _.extend(event, self.keyCoder.getKeys());
                    self.update(event);
                });
            };
        }

        return Editor;
    }
);
