define([
        'jquery',
        'lodash',
        'easeljs',
        'mustache',
        'editor/KeyCoder',
        'editor/Palette',
        'editor/Styles',
        'editor/Model',
        'editor/Exceptions'
    ],
    function($, _, easeljs, mustache, KeyCoder, Palette, Styles, Model, Exceptions) {
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
                        "y": 80,
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
                        "y": 80,
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
                        "y": 80,
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
                        "y": 80,
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

            /**
             * Input fields' change event handler
             * @param input {DOMElement}
             * @param updater {Function} - Function to call with (key, value)
             * @private
             */
            this._onPropChange = function(input, updater) {
                var $input = $(input);
                var key = $input.data("key");
                var value = $input.val();

                //TODO: update window title

                try {
                    updater(key, value);
                } catch(e) {
                    if (e != Exceptions.CAST)
                        throw e;

                    //TODO: alertify
                    window.alert(key + " should be Number");
                }
            };

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

                this.$objectPropsTable.find("input").on("input", function(evt) {
                    self._onPropChange(evt.target, self.model.updateObject.bind(self.model));
                });
            };

            this.hideObjectProps = function() {
                this.$objectPropsTable.html("");
            };

            this.showModelProps = function(model) {
                var modelData = _.omit(model.getData(), "objects");

                renderProps(modelData, this.template.modelProps, this.$modelPropsTable);

                this.$modelPropsTable.find("input").on("input", function(evt) {
                    self._onPropChange(evt.target, self.model.update.bind(self.model));
                });
            };

            this.showModelProps(this.model);
        }

        return Editor;
    }
);
