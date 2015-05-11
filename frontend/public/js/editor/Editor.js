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
        'util/Templater',
        'editor/StringRes'
    ],
    function($, _, easeljs, mustache, KeyCoder, Palette, Styles, Model, Exceptions, Templater, StringRes) {
        /**
         * Main Editor class
         * @param windows {{$canvas: jQuery}}
         * @param client {Client}
         * @constructor
         */
        var Editor = Class.create({
            initialize: function(windows, client) {
                var self = this;
                this.appName = 'jsim';

                this.windows = windows;
                this.client = client;

                this.stage = new easeljs.Stage(windows.$canvas[0]);
                this.stage.enableMouseOver(30);

                var keyCoder = new KeyCoder(windows.$canvas);

                this.template = {
                    modelProps: Templater.makeTemplate('#model-props-template'),
                    objectProps: Templater.makeTemplate('#object-props-template')
                };

                this.dialogs = {
                    modelChooser: $("#model-chooser-dialog"),
                    createConfirm: $("#create-confirm-dialog"),
                    simulationComplete: $('#simulation-complete-dialog'),
                    simulationError: $('#simulation-error-dialog'),
                };

                // cache jQ elements
                this.$modelName = $('.model-name');

                this.$objectPropsTable = $('#object-props-table');
                this.$modelPropsTable = $('#model-props-table');


                keyCoder.addEventListener("keyup", KeyCoder.KEY.DEL, function () {
                    self.model.removeObject();
                });

                keyCoder.addEventListener("keyup", KeyCoder.KEY.Q, function () {
                    console.log("Model data: ", self.model.getData());
                });

                // create empty model
                this.createModel();

                // subscribe to UI events
                $('#simulation-start').click(function () {
                    client.sendModel(self.model.getData(), {
                        onError: self.onSimulationError.bind(self),
                        onComplete: self.onSimulationComplete.bind(self),
                        onProgress: self.onSimulationProgress.bind(self),
                    });
                });

                this.stage.update();
                this.showModelProps(this.model);
            },

            showModalDialog: function ($dialog, params) {
                var fullParams = _.extend({
                    width: "50%",
                    modal: true,
                    show: {
                        effect: "fade",
                        duration: 300
                    },
                    hide: {
                        effect: "fade",
                        duration: 300
                    }
                }, params);

                $dialog.dialog(fullParams);
            },

            onChooseModel: function () {
                var self = this;

                this.client.getModelList({
                        onError: function () {
                            alert("Unable to get model list");
                        },
                        onComplete: function (models) {
                            // setup chooser dialog
                            var $dialog = self.dialogs.modelChooser;
                            var $select = $dialog.find("#model-chooser-dialog-select");
                            $select.empty();

                            _.each(models, function (model) {
                                $select.append(new Option(model.data.name, model._id));
                            });

                            // show chooser dialog
                            self.showModalDialog($dialog, {
                                buttons: [{
                                    text: StringRes.ui.open,
                                    click: function () {
                                        var modelId = $select.val();
                                        self.onLoadModel(modelId);
                                        $(this).dialog("close");
                                    }
                                }, {
                                    text: StringRes.ui.cancel,
                                    click: function () {
                                        $(this).dialog("close");
                                    }
                                }]
                            });
                        }
                    }
                );
            },

            onLoadModel: function (modelId) {
                var self = this;
                this.client.getModel(modelId, {
                    onError: function () {
                        alert("Unable to get model: " + modelId);
                    },
                    onComplete: function (model) {
                        self.createModel(model);
                        alert("Model loaded: " + modelId);
                    }
                });
            },

            onCreateModel: function () {
                var self = this;
                var $dialog = this.dialogs.createConfirm;

                this.showModalDialog($dialog, {
                    buttons: [{
                        text: StringRes.ui.ok,
                        click: function () {
                            self.createModel();
                            $(this).dialog("close");
                        }
                    }, {
                        text: StringRes.ui.cancel,
                        click: function () {
                            $(this).dialog("close");
                        }
                    }]
                });
            },

            createModel: function (data) {
                this.model = new Model(this.stage, this, data, this.model);
                var palette = new Palette(this.stage, this.model, Styles.object, Styles.palette);

                this.showModelProps(this.model);
                this.updateTitle(this.model.getData().name);
            },

            saveModel: function () {
                var self = this;

                var model = this.model.getModel();
                var data = this.model.getData();

                if (model) {
                    this.client.saveModel(model, {
                        onError: function () {
                            alert("Unable to save model");
                        },
                        onComplete: function () {
                            alert("Model saved");
                        }
                    });
                } else {
                    this.client.createModel(data, {
                        onError: function () {
                            alert("Unable to create model");
                        },
                        onComplete: function (model) {
                            self.createModel(model);
                            alert("Model created");
                        }
                    });
                }
            },

            resize: function (w, h) {
                this.stage.update();
            },

            _renderProps: function (props, template, $target, locale) {
                var propsArray = _.map(props, function (value, key) {
                    return {key: key, label: locale[key], value: value};
                });

                var view = {
                    props: propsArray
                };

                var html = mustache.render(template, view);
                $target.html(html);
            },

            /**
             * Input fields' change event handler
             * @param input {DOMElement}
             * @param updater {Function} - Function to call with (key, value)
             * @private
             */
            _onPropChange: function (input, updater) {
                var $input = $(input);
                var key = $input.data("key");
                var value = $input.val();

                if (key == 'name')
                    this.updateTitle(value);

                try {
                    updater(key, value);
                } catch (e) {
                    if (e != Exceptions.CAST)
                        throw e;

                    //TODO: alertify
                    window.alert(key + " should be Number");
                }
            },

            showObjectProps: function (object) {
                var self = this;

                var objectData = object.getData();

                var props = {
                    type: objectData.type,
                    name: objectData.name
                };
                props = _.assign(props, objectData.spec);

                this._renderProps(props,
                    this.template.objectProps,
                    this.$objectPropsTable,
                    StringRes.props.objects);

                // disallow user to modify type
                $('#object-prop_type').prop('disabled', true);

                this.$objectPropsTable.find("input").on("input", function (evt) {
                    self._onPropChange(evt.target, self.model.updateObject.bind(self.model));
                });
            },

            hideObjectProps: function () {
                this.$objectPropsTable.html('');
            },

            showModelProps: function (model) {
                var self = this;

                //var modelData = _.omit(model.getData(), 'objects', 'dateCreated');

                // preserve order
                var modelData = {};
                _.each(_.keys(StringRes.props.model), function (key) {
                    modelData[key] = model.getData()[key];
                });

                this._renderProps(modelData,
                    this.template.modelProps,
                    this.$modelPropsTable,
                    StringRes.props.model);

                this.$modelPropsTable.find("input").on("input", function (evt) {
                    self._onPropChange(evt.target, self.model.update.bind(self.model));
                });
            },

            updateTitle: function (value) {
                this.$modelName.text(value);
                window.document.title = this.appName + ': ' + value;
            },

            onSimulationProgress: function(value) {
                this.windows.$progress.val(value);
                this.windows.$progressLabel.text(parseInt(value, 10) + '%');
            },

            onSimulationComplete: function(stats) {
                this.showModalDialog(this.dialogs.simulationComplete, {
                    buttons: [{
                        text: StringRes.ui.yes,
                        click: function () {
                            window.open('/report?taskId=' + stats.taskId, '_blank');
                            $(this).dialog("close");
                        }
                    }, {
                        text: StringRes.ui.no,
                        click: function () {
                            $(this).dialog("close");
                        }
                    }]
                });
            },

            onSimulationError: function(error, reason) {
                var $dialog = this.dialogs.simulationError;
                var $details = $dialog.find(".details");
                $details.text(error);

                this.showModalDialog($dialog, {
                    buttons: [{
                        text: StringRes.ui.ok,
                        click: function () {
                            $(this).dialog("close");
                        }
                    }]
                });
            }
        });

        return Editor;
    }
);
