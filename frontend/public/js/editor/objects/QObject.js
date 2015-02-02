
define(['easeljs', 'editor/Connector'], function(easeljs, Connector) {
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

        this.connector = new Connector(this.stage, this.parentContainer, style);

        this.container = new easeljs.Container();
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

                    self.connector.setFrom(self, point);
                });

                pointObject.on("pressmove", function(evt) {
                    console.log("Connecting...");
                    evt.stopPropagation();

                    self.connector.move(evt.stageX, evt.stageY);
                });

                pointObject.on("pressup", function(evt) {
                    console.log("Connected");
                    evt.stopPropagation();

                    var targetObject = self.stage.getObjectUnderPoint(evt.stageX, evt.stageY);

                    self.connector.setTo(targetObject);
                    self.connector.createConnection();
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

        this.setText = setText;
        this.setPos = setPos;
    }

    return QObject;
});