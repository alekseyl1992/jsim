define(['lodash', 'easeljs', 'editor/objects/QObject'],
    function(_, easeljs, QObject) {
        var Sink = Class.create(QObject, {
                initialize: function ($super, stage, container, style, data) {
                    _.defaults(data, {
                        type: "sink",
                        spec: {}
                    });
                    $super(stage, container, style, data);

                    this.output = null;

                    this.render();
                    this.drawConnectionPoints();
                },

                render: function (selected) {
                    var gfx = this.shape.graphics;
                    var s = this.style.sizes;
                    var c = this.style.colors;

                    var gradient = selected ? c.selectedGradient : c.gradient;

                    var r = s.h / 2;
                    var delta = r * Math.sqrt(2) / 2;
                    var rectW = s.w - r;

                    // rect
                    gfx.beginStroke(c.contour)
                        .beginLinearGradientFill(gradient,
                        [0, 1], 0, 0, 0, s.h)
                        .drawRect(0, 0, rectW, s.h)
                        .endStroke();


                    var drawCrossedCircle = function (color, lineWidth) {
                        // circle
                        gfx.beginStroke(color)
                            .setStrokeStyle(lineWidth)
                            .drawCircle(rectW, r, r)
                            .endStroke()
                            .endFill();

                        // line \
                        gfx.beginStroke(color)
                            .setStrokeStyle(lineWidth)
                            .moveTo(rectW - delta, r - delta)
                            .lineTo(rectW + delta, r + delta);

                        // line /
                        gfx.beginStroke(color)
                            .setStrokeStyle(lineWidth)
                            .moveTo(rectW - delta, r + delta)
                            .lineTo(rectW + delta, r - delta);
                    };

                    drawCrossedCircle(c.contour, s.contourBold);
                    drawCrossedCircle(gradient[0], s.contourBold / 2);
                }

            }
        );

        return Sink;
    }
);