define([
        'lodash',
        'easeljs',
        'editor/KeyCoder',
        'editor/objects/Source',
        'editor/objects/Queue',
        'editor/objects/Splitter',
        'editor/objects/Sink'
    ],
    function(_, easeljs, KeyCoder, Source, Queue, Splitter, Sink) {
        function Palette(stage, objectStyle, paletteStyle) {
            var self = this;
            this.stage = stage;

            this.container = new easeljs.Container();

            // make palette objects smaller
            var _objectStyle = _.cloneDeep(objectStyle);
            var _os = _objectStyle.sizes;
            _.forEach(_os, function(field, fieldName) {
                _os[fieldName] = field / 2;
            });
            _objectStyle.labelFont = "bold 14px Arial";

            var s = paletteStyle.sizes;
            var c = paletteStyle.colors;

            this.container.x = s.x;
            this.container.y = s.y;

            // draw label
            var label = new easeljs.Text();
            label.x = s.objectOffset;
            label.y = s.objectOffset / 2;
            label.text = "Palette";
            label.font = paletteStyle.labelFont;
            var labelHeight = label.getMeasuredLineHeight() + s.objectOffset;

            // draw palette window
            var objectsCount = 4;
            var width = _os.w + s.objectOffset * 2;
            var height =
                objectsCount * _os.h
                + (objectsCount + 1) * s.objectOffset
                + labelHeight;

            var background = new easeljs.Shape();
            var gfx = background.graphics;
            gfx.beginStroke(c.contour)
                .beginLinearGradientFill(c.gradient, [0, 1], 0, 0, 0, height)
                .drawRect(0, 0, width, height);

            this.container.addChild(background);
            this.container.addChild(label);


            // add objects to palette
            var source = new Source(this.container, _objectStyle, {
                x: s.objectOffset,
                y: s.objectOffset + labelHeight,
                text: "Source"});

            var queue = new Queue(this.container, _objectStyle, {
                x: s.objectOffset,
                y: s.objectOffset * 2 + _os.h + labelHeight,
                text: "Queue"});

            var splitter = new Splitter(this.container, _objectStyle, {
                x: s.objectOffset,
                y: s.objectOffset * 3 + _os.h * 2 + labelHeight,
                text: "Splitter"});

            var sink = new Sink(this.container, _objectStyle, {
                x: s.objectOffset,
                y: s.objectOffset * 4 + _os.h * 3 + labelHeight,
                text: "Sink"});

            this.stage.addChild(this.container);
        }

        return Palette;
    }
);