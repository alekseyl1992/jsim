define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        var Splitter = Class.create(QObject, {
            initialize: function ($super, stage, container, style, data) {
                var s = style.sizes;
                var c = style.colors;

                var _style = _.cloneDeep(style);  // style should stay read only
                _style.sizes.textOffset += s.w - s.bw;

                _.defaults(data, {
                    type: "splitter",
                    spec: {
                        pA: 0.5
                    }
                });
                $super(stage, container, _style, data);

                this.output = [
                    {
                        name: "toA",
                        x: s.w,
                        y: s.h / 2 - s.outputsDelta / 2,
                        connection: null
                    },
                    {
                        name: "toB",
                        x: s.w,
                        y: s.h / 2 + s.outputsDelta / 2,
                        connection: null
                    }
                ];

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
                    .moveTo(s.w - s.bw, 0)
                    .lineTo(s.w, 0)
                    .lineTo(s.w, s.h)
                    .lineTo(s.w - s.bw, s.h)
                    .lineTo(0, s.h / 2)
                    .closePath();
            }
        });

        return Splitter;
    }
);