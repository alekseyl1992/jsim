
define(['easeljs'], function(easeljs) {
    function QObject(stage, style, params) {
        var self = this;

        this.stage = stage;

        var s = style.sizes;
        var c = style.colors;

        this.input = {
            x: 0,
            y: s.h / 2
        };

        this.output = {
            x: s.w,
            y: s.h / 2
        };

        this.container = new easeljs.Container();
        var clickDelta = {x: 0, y: 0};
        this.container.on("mousedown", function(evt) {
            clickDelta.x = self.container.x - evt.stageX;
            clickDelta.y = self.container.y - evt.stageY;
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

        if (params) {
            if (params.x && params.y)
                setPos(params.x, params.y);

            if (params.text)
                setText(params.text);
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

        this.setText = setText;
        this.setPos = setPos;
    }

    return QObject;
});