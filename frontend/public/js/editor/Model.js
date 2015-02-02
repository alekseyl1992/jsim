define([
    'lodash',
    'easeljs',
    'editor/Styles',
    'editor/objects/Source',
    'editor/objects/Queue',
    'editor/objects/Splitter',
    'editor/objects/Sink'
], function(_, easeljs, Styles, Source, Queue, Splitter, Sink) {
    function Model(stage, data) {
        var self = this;

        this.stage = stage;

        this.modelContainer = new easeljs.Container();
        this.stage.addChild(this.modelContainer);

        this.currentUID = 0;  //model-wide unique id
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

        if (data)
            load(data);
        else
            create();


        function load(data) {
            self.data = data;
            // create object according to specified data
            _.each(self.data.objects, function(objectData) {
                addObject(objectData, true);
            });
        }
        this.load = load;

        function create() {
            this.data = {
                name: "Model",
                duration: 1000,
                objects: []
            };
        }
        this.create = create;

        function addObject(data, justAddToStage) {
            var _data = _.cloneDeep(data);  // ensure RO
            var typeEntry = self.typesMap[_data.type];

            if (!justAddToStage) {
                // generate name and id
                _data.name = typeEntry.name + " " + typeEntry.id;
                _data.id = self.currentUID;

                this.data.objects.push(_data);
            }

            typeEntry.id++;
            self.currentUID++;

            // add to stage
            var object = new typeEntry.ctor(self.stage, self.modelContainer, Styles.object, _data);

            return object;
        }
        this.addObject = addObject;

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
