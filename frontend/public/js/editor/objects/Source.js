define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        function Source(stage, container, style, data) {
            _.defaults(data, {
                type: "source",
                spec: {
                    lambda: 1
                }
            });
            _.extend(this, new QObject(stage, container, style, data));
            this.setSelf(this);

            this.input = null;

            this.render = function(selected) {
                var gfx = this.shape.graphics;
                var s = style.sizes;
                var c = style.colors;

                var gradient = selected ? c.selectedGradient : c.gradient;

                gfx.beginStroke(c.contour)
                    .beginLinearGradientFill(gradient,
                    [0, 1], 0, 0, 0, s.h)
                    .moveTo(0, 0)
                    .lineTo(s.bw, 0)
                    .lineTo(s.w, s.h / 2)
                    .lineTo(s.bw, s.h)
                    .lineTo(0, s.h)
                    .closePath();
            };

            this.render();
            this.drawConnectionPoints();
        }

        return Source;
    }
);