define([
        'jquery',
        'lodash',
        'easeljs',
        'mustache',
        'editor/KeyCoder',
        'editor/objects/Source',
        'editor/objects/Queue',
        'editor/objects/Splitter',
        'editor/objects/Sink',
        'editor/Palette',
        'editor/Styles',
        'editor/Model'
    ],
    function($, _, easeljs, mustache, KeyCoder, Source, Queue, Splitter, Sink, Palette, Styles, Model) {
        function Editor(windows) {
            var self = this;

            this.FPS = 30;

            this.windows = windows;
            this.stage = new easeljs.Stage(windows.$canvas[0]);
            this.stage.enableMouseOver(30);

            var keyCoder = new KeyCoder(windows.$canvas);

            // load templates as strings
            function makeTemplate(str) {
                return str.replace(/{/g, "{{").replace(/}/g, "}}");
            }

            this.template = {
                modelProps: makeTemplate($('#model-props-template').html()),
                objectProps: makeTemplate($('#object-props-template').html())
            };

            // cache jQ elements
            this.$objectPropsTable = $('#object-props-table');
            this.$modelPropsTable = $('#model-props-table');

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

            this.model = new Model(this.stage, this, testModelData);
            keyCoder.addEventListener("keyup", KeyCoder.KEY.DEL, function() {
                self.model.removeObject();
            });

            keyCoder.addEventListener("keyup", KeyCoder.KEY.Q, function() {
                console.log("Model data: ", self.model.getData());
            });

            var objectStyle = Styles.object;
            var palette = new Palette(this.stage, self.model, objectStyle, Styles.palette);


            this.stage.update();


            this.resize = function(w, h) {
                this.stage.update();
            };

            function renderProps(props, template, $target) {
                var propsArray = _.map(props, function(value, key) {
                    return {key: key, value: value};
                });

                var view = {
                    props: propsArray
                };

                var html = mustache.render(template, view);
                $target.html(html);
            }

            this.showObjectProps = function(object) {
                var objectData = object.getData();

                var props = {
                    type: objectData.type,
                    name: objectData.name
                };
                props = _.assign(props, objectData.spec);

                renderProps(props, this.template.objectProps, this.$objectPropsTable);

                // disallow user to modify type
                $('#object-prop_type').prop('disabled', true);
            };

            this.hideObjectProps = function() {
                this.$objectPropsTable.html("");
            };

            this.showModelProps = function(model) {
                var modelData = _.omit(model.getData(), "objects");

                renderProps(modelData, this.template.modelProps, this.$modelPropsTable);
            };

            this.showModelProps(this.model);
        }

        return Editor;
    }
);
