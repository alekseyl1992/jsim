define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        var Queue = Class.create(QObject, {
            initialize: function ($super, stage, container, style, data) {
                _.defaults(data, {
                    type: "queue",
                    spec: {
                        mu: 1,
                        channels: 1,
                        limit: -1
                    }
                });
                $super(stage, container, style, data);

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
                    .drawRect(0, 0, s.w, s.h);
            }
        });


        return Queue;
    }
);