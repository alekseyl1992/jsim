define([
        'jquery',
        'lodash',
        'easeljs',
        'mustache',
        'editor/KeyCoder',
        'editor/Palette',
        'editor/Styles',
        'editor/Model',
        'editor/Exceptions',
        'util/Templater'
    ],
    function($, _, easeljs, mustache, KeyCoder, Palette, Styles, Model, Exceptions, Templater) {
        /**
         * Main Editor class
         * @param windows {{$canvas: jQuery}}
         * @param client {Client}
         * @param statsManager {StatsManager}
         * @constructor
         */
        function Editor(windows, client, statsManager) {
            var self = this;

            this.FPS = 30;

            this.windows = windows;
            this.client = client;
            this.statsManager = statsManager;

            this.stage = new easeljs.Stage(windows.$canvas[0]);
            this.stage.enableMouseOver(30);

            var keyCoder = new KeyCoder(windows.$canvas);

            this.template = {
                modelProps: Templater.makeTemplate('#model-props-template'),
                objectProps: Templater.makeTemplate('#object-props-template')
            };

            this.dialogs = {
                modelChooser: $("#model-chooser-dialog"),
                createConfirm: $("#create-confirm-dialog")
            };

            // cache jQ elements
            this.$objectPropsTable = $('#object-props-table');
            this.$modelPropsTable = $('#model-props-table');


            keyCoder.addEventListener("keyup", KeyCoder.KEY.DEL, function() {
                self.model.removeObject();
            });

            keyCoder.addEventListener("keyup", KeyCoder.KEY.Q, function() {
                console.log("Model data: ", self.model.getData());
            });

            var objectStyle = Styles.object;
            var palette = new Palette(this.stage, self.model, objectStyle, Styles.palette);

            // subscribe to UI events
            $('#simulation-start').click(function() {
                client.sendModel(self.model.getData(), {
                    onError: statsManager.onError.bind(statsManager),
                    onComplete: statsManager.onComplete.bind(statsManager),
                    onProgress: statsManager.onProgress.bind(statsManager),
                });
            });

            this.stage.update();


            this.chooseModel = function () {
                client.getModelList({
                        onError: function () {
                            alert("Unable to get model list");
                        },
                        onComplete: function (models) {
                            // setup chooser dialog
                            var $dialog = self.dialogs.modelChooser;
                            var $select = $dialog.find("model-chooser-dialog-select");
                            $select.removeAllChildren();

                            _.each(models, function(model) {
                                $select.append(new Option(model.data.name, model._id));
                            });

                            // show chooser dialog
                            $($dialog).dialog({
                                width: "50%",
                                modal: true,
                                show: {
                                    effect: "fade",
                                    duration: 300
                                },
                                hide: {
                                    effect: "fade",
                                    duration: 300
                                },
                                buttons: {
                                    "Open": function () {
                                        var modelId = $('#model-chooser-dialog-select').val();
                                        self.loadModel(modelId);
                                        $(this).dialog("close");
                                    },
                                    "Cancel": function () {
                                        $(this).dialog("close");
                                    }
                                }
                            });
                        }
                    }
                );
            };

            this.loadModel = function(modelId) {
                client.getModel(modelId, {
                    onError: function () {
                        alert("Unable to get model: " + modelId);
                    },
                    onComplete: function (model) {
                        self.model = new Model(self.stage, self, model);
                        alert("Model loaded: " + modelId);
                    }
                });
            };

            this.createModel = function () {
                this.model = new Model(this.stage, this, null);
            };

            this.saveModel = function () {
                var model = this.model.getModel();
                var data = this.model.getData();

                if (model) {
                    client.saveModel(model, {
                        onError: function () {
                            alert("Unable to save model");
                        },
                        onComplete: function () {
                            alert("Model saved");
                        }
                    });
                } else {
                    client.createModel(data, {
                        onError: function () {
                            alert("Unable to create model");
                        },
                        onComplete: function (model) {
                            self.model = new Model(self.stage, self, model);
                            alert("Model created");
                        }
                    });
                }
            };

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

            this.createModel();
            this.showModelProps(this.model);
        }

        return Editor;
    }
);
