
define(['easeljs', 'editor/Connection'], function(easeljs, Connection) {
    function QObject(stage, parentContainer, style, data) {
        var self = this;

        this.stage = stage;
        this.parentContainer = parentContainer;

        this.data = data;

        var s = style.sizes;
        var c = style.colors;

        this.input = {
            x: 0,
            y: s.h / 2,
            connections: []
        };

        this.output = {
            x: s.w,
            y: s.h / 2,
            connection: null
        };

        this.newConnection = new Connection(this.stage, this.parentContainer, style);

        this.container = new easeljs.Container();
        this.container.jsimObject = this;

        var clickDelta = {x: 0, y: 0};

        this.container.on("mousedown", function(evt) {
            clickDelta.x = self.container.x - evt.stageX;
            clickDelta.y = self.container.y - evt.stageY;

            // bring to front
            var childrenCount = self.parentContainer.getNumChildren();
            self.parentContainer.setChildIndex(self.container, childrenCount - 1);

            self.stage.update();
        });

        this.container.on("pressmove", function(evt) {
            self.container.x = evt.stageX + clickDelta.x;
            self.container.y = evt.stageY + clickDelta.y;

            // update connections
            var connections = [];

            if (self.input)
                connections = connections.concat(self.input.connections);

            if (self.output) {
                if (self.output.connection) {
                    connections.push(self.output.connection);
                } else if (_.isArray(self.output)) {
                    _.each(self.output, function (output) {
                        if (output.connection)
                            connections.push(output.connection);
                    });
                }
            }

            _.each(connections, function(connection) {
                connection.render();
            });

            self.stage.update();
        });

        this.shape = new easeljs.Shape();
        this.container.addChild(this.shape);

        this.text = new easeljs.Text();
        this.text.textBaseline = "middle";
        this.text.font = style.labelFont;
        this.text.x = s.textOffset;
        this.text.y = s.h / 2;

        this.container.addChild(this.text);

        if (data) {
            if (data.x && data.y)
                setPos(data.x, data.y);

            if (data.name)
                setText(data.name);
        }

        this.parentContainer.addChild(this.container);

        function setText(text) {
            self.text.text = text;
        }

        function setPos(x, y) {
            self.container.x = x;
            self.container.y = y;
        }

        this.drawConnectionPoints = function() {
            // ensure array
            var points = _.compact(_.flatten([this.output]));

            _.each(points, function(point) {
                var pointObject = new easeljs.Shape();
                pointObject.x = point.x;
                pointObject.y = point.y;

                var gfx = pointObject.graphics;
                gfx.beginStroke(c.contour)
                    .beginFill(c.connectionPointFill)
                    .drawCircle(0, 0, s.connectionPointRadius);

                pointObject.on("mouseover", function(evt) {
                    var scaleFactor = 2;
                    evt.target.scaleX = scaleFactor;
                    evt.target.scaleY = scaleFactor;
                    stage.update();
                });

                pointObject.on("mouseout", function(evt) {
                    evt.target.scaleX = 1;
                    evt.target.scaleY = 1;
                    stage.update();
                });

                // connections stuff
                pointObject.on("mousedown", function(evt) {
                    console.log("Connecting");
                    evt.stopPropagation();

                    self.newConnection.setFrom({
                        object: self,
                        output: point
                    });
                });

                pointObject.on("pressmove", function(evt) {
                    console.log("Connecting...");
                    evt.stopPropagation();

                    self.newConnection.render({
                        x: evt.stageX,
                        y: evt.stageY
                    });
                });

                pointObject.on("pressup", function(evt) {
                    console.log("Connected");
                    evt.stopPropagation();

                    var targetObject = self.stage.getObjectUnderPoint(evt.stageX, evt.stageY);

                    if (targetObject && targetObject.parent && targetObject.parent.jsimObject) {
                        var target = targetObject.parent.jsimObject;

                        self.newConnection.setTo({
                            object: target,
                            input: target.input
                        });
                        self.newConnection.fix();
                    } else {
                        self.newConnection.remove();
                    }

                    self.newConnection = new Connection(stage, parentContainer, style);
                });

                self.container.addChild(pointObject);
            });
        };

        this.getData = function() {
            return data;
        };

        this.getContainer = function() {
            return self.container;
        };

        /**
         * Should be called after _.extend(),
         * so self will point on extended object, not to the source one
         * @param newSelf - Object derived from QObject
         */
        this.setSelf = function(newSelf) {
            self = newSelf;
        };

        this.setText = setText;
        this.setPos = setPos;

        this.select = function() {
            this.render(true);
            this.stage.update();
        };

        this.unselect = function() {
            this.render();
            this.stage.update();
        };

        this.remove = function() {
            this.parentContainer.removeChild(this.container);
            this.stage.update();
        };

        this.addConnection = function(connection) {
            var from = connection.getFrom();
            var to = connection.getTo();

            if (from.object == this) {
                if (_.isArray(this.output)) {
                    console.assert(from.output.name, "output is array, but no has no 'name'");
                    this.data[from.output.name] = to.object.data.id;
                } else {
                    this.data.to = connection;
                }

                from.output.connection = connection;
            } else if (to.object == this) {
                to.input.connections.push(connection);
            } else {
                console.error("addConnection called on not matching object");
                console.error("connection: ", connection);
                console.error("object: ", this);
            }
        };

        this.removeConnection = function(connection) {
            var from = connection.getFrom();
            var to = connection.getTo();

            if (from.object == this) {
                if (_.isArray(this.output)) {
                    console.assert(from.output.name, "output is array, but no has no 'name'");
                    this.data[from.output.name] = null;
                } else {
                    this.data.to = null;
                }

                from.output.connection = null;
            } else if (to.object == this) {
                to.input.connections.remove(connection);
            } else {
                console.error("removeConnection called on not matching object");
                console.error("connection: ", connection);
                console.error("object: ", this);
            }
        };

        this.getOutputByName = function(name) {
            if (name == "to")
                return this.output;

            return _.find(this.output, function(output) {
                return output.name == name;
            });
        };

        this.getInput = function() {
            return this.input;
        };

        this.getOutput = function() {
            return this.output;
        };

        this.getPos = function() {
            return {
                x: this.container.x,
                y: this.container.y
            };
        };
    }

    return QObject;
});