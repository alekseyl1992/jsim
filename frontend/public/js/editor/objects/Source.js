define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        var Source = Class.create(QObject, {
            initialize: function ($super, stage, container, style, data) {
                _.defaults(data, {
                    type: "source",
                    spec: {
                        lambda: 1
                    }
                });
                $super(stage, container, style, data);

                this.input = null;

                this.render();
                this.drawConnectionPoints();
            },

            render: function(selected) {
                var gfx = this.shape.graphics;
                var s = this.style.sizes;
                var c = this.style.colors;

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
            }
        });

        return Source;
    }
);