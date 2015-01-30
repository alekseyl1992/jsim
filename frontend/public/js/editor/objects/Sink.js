define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        function Sink(stage, style, params) {
            _.extend(this, new QObject(stage, style, params));
            this.output = null;

            var gfx = this.shape.graphics;
            var s = style.sizes;
            var c = style.colors;

            // rect
            gfx.beginStroke(c.contour)
                .beginLinearGradientFill(c.gradient,
                [0, 1], 0, 0, 0, s.h)
                .drawRect(0, 0, s.bw, s.h)
                .endStroke();

            var drawCrossedCircle = function(color, lineWidth) {
                // circle
                gfx.beginStroke(color)
                    .setStrokeStyle(lineWidth)
                    .drawCircle(s.bw, s.h / 2, s.h / 2)
                    .endStroke()
                    .endFill();

                var r = s.h / 2;
                var delta = r * Math.sqrt(2) / 2;

                // line \
                gfx.beginStroke(color)
                    .setStrokeStyle(lineWidth)
                    .moveTo(s.bw - delta, r - delta)
                    .lineTo(s.bw + delta, r + delta);

                // line /
                gfx.beginStroke(color)
                    .setStrokeStyle(lineWidth)
                    .moveTo(s.bw - delta, r + delta)
                    .lineTo(s.bw + delta, r - delta);
            };

            drawCrossedCircle(c.contour, s.contourBold);
            drawCrossedCircle(c.gradient[0], s.contourBold / 2);

            this.drawConnectionPoints();
        }

        return Sink;
    }
);