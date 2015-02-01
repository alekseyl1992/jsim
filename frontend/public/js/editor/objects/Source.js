define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        function Source(stage, container, style, data) {
            var _data = _.assign(_.cloneDeep(data), {
                type: "source",
                spec: {
                    lambda: 1
                }
            });
            _.extend(this, new QObject(stage, container, style, _data));
            this.input = null;

            var gfx = this.shape.graphics;
            var s = style.sizes;
            var c = style.colors;

            gfx.beginStroke(c.contour)
                .beginLinearGradientFill(c.gradient,
                [0, 1], 0, 0, 0, s.h)
                .moveTo(0, 0)
                .lineTo(s.bw, 0)
                .lineTo(s.w, s.h / 2)
                .lineTo(s.bw, s.h)
                .lineTo(0, s.h)
                .closePath();

            this.drawConnectionPoints();
        }

        return Source;
    }
);