define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        function Sink(stage, container, style, data) {
            var _data = _.assign(_.cloneDeep(data), {
                type: "sink",
                spec: {}
            });
            _.extend(this, new QObject(stage, container, style, _data));
            this.output = null;

            var gfx = this.shape.graphics;
            var s = style.sizes;
            var c = style.colors;

            var r = s.h / 2;
            var delta = r * Math.sqrt(2) / 2;
            var rectW = s.w - r;

            // rect
            gfx.beginStroke(c.contour)
                .beginLinearGradientFill(c.gradient,
                [0, 1], 0, 0, 0, s.h)
                .drawRect(0, 0, rectW, s.h)
                .endStroke();

            var drawCrossedCircle = function(color, lineWidth) {
                var r = s.h / 2;
                var delta = r * Math.sqrt(2) / 2;

                // circle
                gfx.beginStroke(color)
                    .setStrokeStyle(lineWidth)
                    .drawCircle(rectW, r, r)
                    .endStroke()
                    .endFill();

                // line \
                gfx.beginStroke(color)
                    .setStrokeStyle(lineWidth)
                    .moveTo(rectW - delta, r - delta)
                    .lineTo(rectW + delta, r + delta);

                // line /
                gfx.beginStroke(color)
                    .setStrokeStyle(lineWidth)
                    .moveTo(rectW - delta, r + delta)
                    .lineTo(rectW + delta, r - delta);
            };

            drawCrossedCircle(c.contour, s.contourBold);
            drawCrossedCircle(c.gradient[0], s.contourBold / 2);

            this.drawConnectionPoints();
        }

        return Sink;
    }
);