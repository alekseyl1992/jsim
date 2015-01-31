define([
    'lodash',
    'editor/Styles',
    'editor/objects/Source',
    'editor/objects/Queue',
    'editor/objects/Splitter',
    'editor/objects/Sink'
], function(_, Styles, Source, Queue, Splitter, Sink) {
    function Model(stage, data) {
        var self = this;

        this.stage = stage;

        this.currentUID = 0;  //model-wide unique id
        this.typesMap = {
            "source": {
                ctor: Source,
                name: "Source",
                id: 0  // type-wide unique id
            },
            "queue": {
                ctor: Queue,
                name: "Queue",
                id: 0
            },
            "splitter": {
                ctor: Splitter,
                name: "Splitter",
                id: 0
            },
            "sink": {
                ctor: Sink,
                name: "Sink",
                id: 0
            }
        };

        if (data) {
            this.data = data;
            // create object according to specified data
            _.each(this.data.objects, function(objectData) {
                self.addObject(objectData, true);
            });
        } else {
            this.data = {
                name: "Model",
                duration: 1000,
                objects: []
            };
        }


        this.addObject = function(data, justAddToStage) {
            var _data = _.cloneDeep(data);  // ensure RO
            var typeEntry = this.typesMap[_data.type];

            if (!justAddToStage) {
                // generate name and id
                _data.name = typeEntry.name + " " + typeEntry.id++;
                _data.id = this.currentUID++;

                this.data.objects.push(_data);
            }

            // add to stage
            var object = new typeEntry.ctor(this.stage, Styles.object, _data);

            return object;
        };

        //TODO
        this.removeObject = function(object) {

        };

        this.updateObject = function(object, field, value) {

        };

        this.getData = function() {
            return data;
        };
    }


    return Model;
});
