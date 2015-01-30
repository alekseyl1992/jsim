define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        function Splitter(stage, style, params) {
            var s = style.sizes;
            var c = style.colors;

            var _style = _.cloneDeep(style);  // style should stay read only
            _style.sizes.textOffset += s.w - s.bw;

            _.extend(this, new QObject(stage, _style, params));

            this.output = [
                {
                    x: s.w,
                    y: s.h / 2 - s.outputsDelta / 2
                },
                {
                    x: s.w,
                    y: s.h / 2 + s.outputsDelta / 2
                }
            ];


            var gfx = this.shape.graphics;


            gfx.beginStroke(c.contour)
                .beginLinearGradientFill(c.gradient,
                [0, 1], 0, 0, 0, s.h)
                .moveTo(s.w - s.bw, 0)
                .lineTo(s.w, 0)
                .lineTo(s.w, s.h)
                .lineTo(s.w - s.bw, s.h)
                .lineTo(0, s.h / 2)
                .closePath();

            this.drawConnectionPoints();
        }

        return Splitter;
    }
);