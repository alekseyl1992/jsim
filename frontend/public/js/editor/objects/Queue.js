define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        function Queue(stage, container, style, data) {
            var _data = _.assign(_.cloneDeep(data), {
                type: "queue",
                spec: {
                    mu: 1,
                    channels: 1,
                    limit: -1
                }
            });
            _.extend(this, new QObject(stage, container, style, _data));
            this.setSelf(this);

            this.render = function(selected) {
                var gfx = this.shape.graphics;
                var s = style.sizes;
                var c = style.colors;

                var gradient = selected ? c.selectedGradient : c.gradient;

                gfx.beginStroke(c.contour)
                    .beginLinearGradientFill(gradient,
                    [0, 1], 0, 0, 0, s.h)
                    .drawRect(0, 0, s.w, s.h);
            };

            this.render();
            this.drawConnectionPoints();
        }

        return Queue;
    }
);