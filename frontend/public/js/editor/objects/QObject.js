
define(['easeljs'], function(easeljs) {
    function QObject(stage, style, params) {
        var self = this;

        this.stage = stage;

        var s = style.sizes;
        var c = style.colors;

        this.input = {
            x: 0,
            y: s.h / 2
        };

        this.output = {
            x: s.w,
            y: s.h / 2
        };

        this.container = new easeljs.Container();
        this.container.on("pressmove", function(evt) {
            evt.target.x = evt.stageX;
            evt.target.y = evt.stageY;
            self.stage.update();
        });

        this.shape = new easeljs.Shape();
        this.container.addChild(this.shape);

        this.text = new easeljs.Text();
        this.text.textBaseline = "middle";
        this.text.font = style.labelFont;
        this.text.x = s.textOffset;
        this.text.y = s.h / 2;

        this.container.addChild(this.text);

        if (params) {
            if (params.x && params.y)
                setPos(params.x, params.y);

            if (params.text)
                setText(params.text);
        }

        this.stage.addChild(this.container);

        function setText(text) {
            self.text.text = text;
        }

        function setPos(x, y) {
            self.container.x = x;
            self.container.y = y;
        }

        this.setText = setText;
        this.setPos = setPos;
    }

    return QObject;
});