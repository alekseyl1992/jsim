define([
        'jquery',
        'lodash',
        'easeljs',
        'mustache',
        'alertify',
        'editor/KeyCoder',
        'editor/Palette',
        'editor/Styles',
        'editor/Model',
        'editor/Exceptions',
        'util/Templater',
        'editor/StringRes'
    ],
    function($, _, easeljs, mustache, alertify, KeyCoder, Palette, Styles, Model, Exceptions, Templater, StringRes) {
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
                    objectProps: Templater.makeTemplate('#object-props-template'),
                    modelRemove: Templater.makeTemplate('#model-remove-template')
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
                    var modelData = self.model.getModel() || self.model.getData();

                    client.sendModel(modelData, {
                        onError: self.onSimulationError.bind(self),
                        onComplete: self.onSimulationComplete.bind(self),
                        onProgress: self.onSimulationProgress.bind(self)
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
                            alertify.error(StringRes.messages.unableToGetModelList);
                        },
                        onComplete: function (models) {
                            // setup chooser dialog
                            var $dialog = self.dialogs.modelChooser;
                            var $table = $dialog.find("#model-chooser-dialog-table");
                            $table.bootstrapTable('destroy');
                            $table.empty();

                            $table.bootstrapTable({
                                data: _.map(models,
                                    function(model) {
                                        return {
                                            modelName: model.data.name,
                                            author: model.authorId.username,
                                            id: model._id
                                        };
                                    }
                                ),
                                columns: [{
                                    field: 'modelName',
                                    title: StringRes.modelChooser.modelName,
                                    formatter: function (name, model) {
                                        //TODO: render link
                                        return name;
                                    }
                                }, {
                                    field: 'author',
                                    title: StringRes.modelChooser.author
                                }, {
                                    formatter: function (field, model) {
                                        return mustache.render(
                                            self.template.modelRemove,
                                            { modelId: model.id }
                                        );
                                    },
                                    events: {
                                        'click .model-remove': function (e, value, row, index) {
                                            alertify.set({
                                                labels: {
                                                    ok: StringRes.ui.ok,
                                                    cancel: StringRes.ui.cancel
                                                }
                                            });

                                            alertify.confirm(
                                                StringRes.messages.modelRemove,
                                                function (e) {
                                                    e && self.onRemoveModel(row.id);
                                                }
                                            );

                                            e.stopPropagation();
                                        }
                                    }
                                }],
                                onClickRow: function (row) {
                                    self.onLoadModel(row.id);
                                    $dialog.dialog("close");
                                }
                            });
                            $table.bootstrapTable('hideLoading');

                            // show chooser dialog
                            self.showModalDialog($dialog, {
                                buttons: [{
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
                        alertify.error(StringRes.messages.unableToLoadModel + ': ' + modelId);
                    },
                    onComplete: function (model) {
                        self.createModel(model);
                        alertify.success(StringRes.messages.modelLoaded + ': ' + model.data.name);
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
                this.hideObjectProps();
                this.updateTitle(this.model.getData().name);
            },

            saveModel: function () {
                var self = this;

                var model = this.model.getModel();
                var data = this.model.getData();

                if (model) {
                    this.client.saveModel(model, {
                        onError: function () {
                            alertify.error(StringRes.messages.unableToSaveModel);
                        },
                        onComplete: function () {
                            alertify.success(StringRes.messages.modelSaved);
                        }
                    });
                } else {
                    this.client.createModel(data, {
                        onError: function () {
                            alertify.error(StringRes.messages.unableToSaveModel);
                        },
                        onComplete: function (model) {
                            self.createModel(model);
                            alertify.success(StringRes.messages.modelSaved);
                        }
                    });
                }
            },

            onRemoveModel: function (modelId) {
                var self = this;
                this.client.removeModel({ modelId: modelId }, {
                    onError: function () {
                        alertify.error(StringRes.messages.unableToRemoveModel);
                    },
                    onComplete: function () {
                        self.onChooseModel();
                        alertify.success(StringRes.messages.modelRemoved);
                    }
                });
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

                try {
                    updater(key, value);
                } catch (e) {
                    if (e != Exceptions.CAST)
                        throw e;

                    alertify.error(key + ' ' + StringRes.messages.shouldBeANumber);
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
                    self._onPropChange(evt.target, function (key, value) {
                        self.model.update(key, value);

                        if (key == 'name')
                            self.updateTitle(value);
                    });
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

                if (_.isString(error)) {
                    $details.text(error);
                } else {
                    $details.text(StringRes.messages.httpError);
                }

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
