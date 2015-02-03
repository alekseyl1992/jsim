define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        function Splitter(stage, container, style, data) {
            var s = style.sizes;
            var c = style.colors;

            var _style = _.cloneDeep(style);  // style should stay read only
            _style.sizes.textOffset += s.w - s.bw;

            var _data = _.assign(_.cloneDeep(data), {
                type: "splitter",
                spec: {
                    pA: 0.5
                }
            });
            _.extend(this, new QObject(stage, container, _style, _data));
            this.setSelf(this);

            this.output = [
                {
                    x: s.w,
                    y: s.h / 2 - s.outputsDelta / 2,
                    connection: null
                },
                {
                    x: s.w,
                    y: s.h / 2 + s.outputsDelta / 2,
                    connection: null
                }
            ];


            this.render = function(selected) {
                var gfx = this.shape.graphics;
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
            };

            this.render();
            this.drawConnectionPoints();
        }

        return Splitter;
    }
);