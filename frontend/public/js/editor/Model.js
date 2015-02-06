define([
    'lodash',
    'easeljs',
    'editor/Styles',
    'editor/objects/Source',
    'editor/objects/Queue',
    'editor/objects/Splitter',
    'editor/objects/Sink',
    'editor/Connection',
    'editor/Exceptions'
], function(_, easeljs, Styles, Source, Queue, Splitter, Sink, Connection, Exceptions) {
    function Model(stage, editor, data) {
        var self = this;

        this.stage = stage;

        this.modelContainer = new easeljs.Container();
        this.stage.addChild(this.modelContainer);

        this.selectedObject = null;

        this.objects = [];  // QObject derivatives

        this.currentUID = 1;  //model-wide unique id, should be non-zero for if (id) syntax
        this.typesMap = {
            "source": {
                ctor: Source,
                name: "Source",
                id: 1  // type-wide unique id
            },
            "queue": {
                ctor: Queue,
                name: "Queue",
                id: 1
            },
            "splitter": {
                ctor: Splitter,
                name: "Splitter",
                id: 1
            },
            "sink": {
                ctor: Sink,
                name: "Sink",
                id: 1
            }
        };

        this.stage.on("stagemousedown", function() {
            self.selectObject(null);
        });

        if (data)
            load(data);
        else
            create();


        function load(data) {
            self.data = data;
            // create objects according to specified data
            _.each(self.data.objects, function(objectData) {
                addObject(objectData, true);
            });

            // create connections for new objects
            _.each(self.objects, function(fromObject) {
                var fromObjectData = fromObject.getData();

                var toObject = null;  // because of lack of 'let' and block-scoped vars
                if (fromObjectData.to) {
                    toObject = getObjectById(fromObjectData.to);
                    connectByOutputName(fromObject, toObject, "to");
                } else {
                    if (fromObjectData.toA) {
                        toObject = getObjectById(fromObjectData.toA);
                        connectByOutputName(fromObject, toObject, "toA");
                    }
                    if (fromObjectData.toB) {
                        toObject = getObjectById(fromObjectData.toB);
                        connectByOutputName(fromObject, toObject, "toB");
                    }
                }
            });

        }
        this.load = load;

        function connectByOutputName(fromObject, toObject, outputName) {
            var input = toObject.getInput();
            var output = fromObject.getOutputByName(outputName);

            var connection = new Connection(self.stage, self.modelContainer, Styles.object);
            connection.setFrom({
                object: fromObject,
                output: output
            });
            connection.setTo({
                object: toObject,
                input: input
            });
            connection.fix();
        }

        function create() {
            this.data = {
                name: "Model",
                duration: 1000,
                objects: []
            };
        }
        this.create = create;

        function getObjectById(id) {
            return _.find(self.objects, function(object) {
                return object.getData().id == id;
            });
        }
        this.getObjectById = getObjectById;

        function addObject(data, justAddToStage) {
            var _data = data; //_.cloneDeep(data);  // ensure RO
            var typeEntry = self.typesMap[_data.type];

            if (!justAddToStage) {
                // generate name and id
                _data.name = typeEntry.name + " " + typeEntry.id;
                _data.id = self.currentUID.toString();

                this.data.objects.push(_data);
            }

            typeEntry.id++;
            self.currentUID++;

            // add to stage
            var object = new typeEntry.ctor(self.stage, self.modelContainer, Styles.object, _data);
            var container = object.getContainer();

            container.on("mousedown", function(evt) {
                self.selectObject(object);
            });

            self.objects.push(object);

            return object;
        }
        this.addObject = addObject;

        this.removeObject = function(object) {
            object = object || this.selectedObject;

            if (object) {
                this.data.objects.remove(object.getData());
                this.objects.remove(object);
                object.remove();
            }
        };

        /**
         * Sets property key of object to value according to obj[key] type
         * @param obj {Object}
         * @param key {String}
         * @param value {String|Number}
         * @private
         */
        this._setProp = function(obj, key, value) {
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
        };

        this.update = function(key, value) {
            this._setProp(this.data, key, value);
        };

        this.updateObject = function(key, value, object) {
            object = object || this.selectedObject;
            var objectData = object.getData();

            if (key == "name")
                this._setProp(objectData, key, value);
            else
                this._setProp(objectData.spec, key, value);
        };

        this.selectObject = function(object) {
            if (this.selectedObject)
                this.selectedObject.unselect();

            if (object) {
                this.selectedObject = object;
                object.select();

                editor.showObjectProps(object);
            } else {
                editor.hideObjectProps();
            }
        };

        this.getData = function() {
            return data;
        };
    }


    return Model;
});
