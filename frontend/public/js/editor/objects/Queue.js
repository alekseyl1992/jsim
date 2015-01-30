define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        function Queue(stage, style, params) {
            _.extend(this, new QObject(stage, style, params));

            var gfx = this.shape.graphics;
            var s = style.sizes;
            var c = style.colors;

            gfx.beginStroke(c.contour)
                .beginLinearGradientFill(c.gradient,
                [0, 1], 0, 0, 0, s.h)
                .drawRect(0, 0, s.w, s.h);

            this.drawConnectionPoints();
        }

        return Queue;
    }
);