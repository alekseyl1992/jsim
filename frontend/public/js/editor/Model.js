define([
    'lodash',
    'easeljs',
    'editor/Styles',
    'editor/objects/Source',
    'editor/objects/Queue',
    'editor/objects/Splitter',
    'editor/objects/Sink',
    'editor/Connection',
    'editor/Exceptions',
    'editor/StringRes'
], function(_, easeljs, Styles, Source, Queue, Splitter, Sink, Connection, Exceptions, StringRes) {
    var Model = Class.create({
        initialize: function (stage, editor, model, oldModel) {
            var self = this;

            this.stage = stage;
            this.editor = editor;

            this.model = model;
            this.data = null;

            if (oldModel)
                this.stage.removeChild(oldModel.modelContainer);

            this.modelContainer = new easeljs.Container();
            this.stage.addChild(this.modelContainer);

            this.selectedObject = null;

            this.objects = [];  // QObject derivatives

            this.currentUID = 1;  //model-wide unique id, should be non-zero for if (id) syntax
            this.typesMap = {
                "source": {
                    ctor: Source,
                    name: StringRes.source,
                    id: 1  // type-wide unique id
                },
                "queue": {
                    ctor: Queue,
                    name: StringRes.queue,
                    id: 1
                },
                "splitter": {
                    ctor: Splitter,
                    name: StringRes.splitter,
                    id: 1
                },
                "sink": {
                    ctor: Sink,
                    name: StringRes.sink,
                    id: 1
                }
            };

            this.stage.on("stagemousedown", function () {
                self.selectObject(null);
            });

            if (model && model.data)
                this.load(model.data);
            else
                this.create();

            this.stage.update();
        },

        load: function (data) {
            var self = this;

            this.data = data;
            // create objects according to specified data
            _.each(this.data.objects, function (objectData) {
                this.addObject(objectData, true);
            }, this);

            // create connections for new objects
            _.each(self.objects, function (fromObject) {
                var fromObjectData = fromObject.getData();

                var toObject = null;  // because of lack of 'let' and block-scoped vars
                if (fromObjectData.to) {
                    toObject = this.getObjectById(fromObjectData.to);
                    this.connectByOutputName(fromObject, toObject, "to");
                } else {
                    if (fromObjectData.toA) {
                        toObject = this.getObjectById(fromObjectData.toA);
                        this.connectByOutputName(fromObject, toObject, "toA");
                    }
                    if (fromObjectData.toB) {
                        toObject = this.getObjectById(fromObjectData.toB);
                        this.connectByOutputName(fromObject, toObject, "toB");
                    }
                }
            }, this);
        },

        create: function() {
            this.data = {
                name: "Model",
                duration: 1000,
                runs: 1,
                objects: []
            };
        },

        connectByOutputName: function (fromObject, toObject, outputName) {
            var input = toObject.getInput();
            var output = fromObject.getOutputByName(outputName);

            var connection = new Connection(this.stage, this.modelContainer, Styles.object);
            connection.setFrom({
                object: fromObject,
                output: output
            });
            connection.setTo({
                object: toObject,
                input: input
            });
            connection.fix();
        },


        getObjectById: function (id) {
            return _.find(this.objects, function(object) {
                return object.getData().id == id;
            });
        },

        addObject: function (data, justAddToStage) {
            var self  = this;

            var _data = data; //_.cloneDeep(data);  // ensure RO
            var typeEntry = this.typesMap[_data.type];

            if (!justAddToStage) {
                // generate name and id
                _data.name = typeEntry.name + " " + typeEntry.id;
                _data.id = self.currentUID.toString();

                this.data.objects.push(_data);
            }

            typeEntry.id++;
            this.currentUID++;

            // add to stage
            var object = new typeEntry.ctor(this.stage, this.modelContainer, Styles.object, _data);
            var container = object.getContainer();

            container.on("mousedown", function(evt) {
                self.selectObject(object);
            });

            this.objects.push(object);

            return object;
        },

        removeObject: function(object) {
            object = object || this.selectedObject;

            if (object) {
                this.data.objects.remove(object.getData());
                this.objects.remove(object);
                object.remove();
            }
        },

        /**
         * Sets property key of object to value according to obj[key] type
         * @param obj {Object}
         * @param key {String}
         * @param value {String|Number}
         * @private
         */
        _setProp: function(obj, key, value) {
            if (_.isNumber(obj[key])) {
                var parsed = parseFloat(value);
                if (!_.isNaN(parsed)) {
                    obj[key] = parsed;
                } else {
                    throw Exceptions.CAST;
                }
            } else {
                obj[key] = value;
            }
        },

        update: function(key, value) {
            this._setProp(this.data, key, value);
        },

        updateObject: function(key, value, object) {
            object = object || this.selectedObject;
            var objectData = object.getData();

            if (key == "name") {
                object.setName(value);
            } else {
                this._setProp(objectData.spec, key, value);
            }
        },

        selectObject: function(object) {
            if (this.selectedObject)
                this.selectedObject.unselect();

            if (object) {
                this.selectedObject = object;
                object.select();

                this.editor.showObjectProps(object);
            } else {
                this.editor.hideObjectProps();
            }
        },

        getData: function() {
            return this.data;
        },

        getModel: function() {
            return this.model;
        }
    });

    return Model;
});
