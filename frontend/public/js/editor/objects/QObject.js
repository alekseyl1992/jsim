
define(['easeljs'], function(easeljs) {
    function QObject(stage, style, data) {
        var self = this;

        this.stage = stage;
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

        this.container = new easeljs.Container();
        var clickDelta = {x: 0, y: 0};
        this.container.on("mousedown", function(evt) {
            clickDelta.x = self.container.x - evt.stageX;
            clickDelta.y = self.container.y - evt.stageY;

            // bring to front
            var childrenCount = self.stage.getNumChildren();
            self.stage.setChildIndex(self.container, childrenCount - 1);
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

        this.stage.addChild(this.container);

        function setText(text) {
            self.text.text = text;
        }

        function setPos(x, y) {
            self.container.x = x;
            self.container.y = y;
        }

        this.drawConnectionPoints = function() {
            var gfx = this.shape.graphics;
            var s = style.sizes;
            var c = style.colors;

            var points = _.compact(_.flatten([this.input, this.output]));

            _.each(points, function(point) {
                gfx.beginStroke(c.contour)
                    .beginFill(c.connectionPointFill)
                    .drawCircle(point.x, point.y, s.connectionPointRadius);
            });
        };

        this.getData = function() {
            return data;
        };

        this.setText = setText;
        this.setPos = setPos;
    }

    return QObject;
});