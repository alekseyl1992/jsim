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
        'editor/Model'
    ],
    function(_, easeljs, KeyCoder, Source, Queue, Splitter, Sink, Palette, Styles, Model) {
        function Editor(windows) {
            var self = this;

            this.FPS = 30;

            this.windows = windows;
            this.stage = new easeljs.Stage(windows.$canvas[0]);
            this.stage.enableMouseOver(30);

            var keyCoder = new KeyCoder(windows.$canvas);

            windows.$canvas.click(function() {
                windows.$canvas.focus();
            });

            var testModelData = {
                "duration": 1000,
                "name": "Model 1",
                "objects": [
                    {
                        "type": "source",
                        "name": "Source 1",
                        "x": 210,
                        "y": 20,
                        "id": 1,
                        "to": 2,
                        "spec": {
                            "lambda": 1
                        }
                    },
                    {
                        "type": "queue",
                        "name": "Queue 1",
                        "x": 420,
                        "y": 20,
                        "id": 2,
                        "to": 3,
                        "spec": {
                            "mu": 1,
                            "channels": 10,
                            "limit": -1
                        }
                    },
                    {
                        "type": "splitter",
                        "name": "Splitter 1",
                        "x": 630,
                        "y": 20,
                        "id": 3,
                        "toA": 2,
                        "toB": 4,
                        "spec": {
                            "pA": 0.5
                        }
                    },
                    {
                        "type": "sink",
                        "name": "Sink 1",
                        "x": 840,
                        "y": 20,
                        "id": 4,
                        "spec": {}
                    }
                ]
            };

            var model = new Model(this.stage, testModelData);
            keyCoder.addEventListener("keyup", KeyCoder.KEY.DEL, function() {
                model.removeObject();
            });

            keyCoder.addEventListener("keyup", KeyCoder.KEY.Q, function() {
                console.log("Model data: ", model.getData());
            });

            var objectStyle = Styles.object;
            var palette = new Palette(this.stage, model, objectStyle, Styles.palette);


            this.stage.update();


            this.resize = function(w, h) {
                this.stage.update();
            };
        }

        return Editor;
    }
);
