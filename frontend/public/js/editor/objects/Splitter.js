define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        function Splitter(stage, style, params) {
            var _style = _.cloneDeep(style);  // style should stay read only
            _style.sizes.textOffset += style.sizes.w - style.sizes.bw;

            _.extend(this, new QObject(stage, _style, params));

            var gfx = this.shape.graphics;
            var s = style.sizes;
            var c = style.colors;

            gfx.beginStroke(c.contour)
                .beginLinearGradientFill(c.gradient,
                [0, 1], 0, 0, 0, s.h)
                .moveTo(s.w - s.bw, 0)
                .lineTo(s.w, 0)
                .lineTo(s.w, s.h)
                .lineTo(s.w - s.bw, s.h)
                .lineTo(0, s.h / 2)
                .closePath();
        }

        return Splitter;
    }
);