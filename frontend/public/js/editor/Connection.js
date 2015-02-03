define(['easeljs'], function(easeljs) {
    function Connection(stage, parentContainer, style) {
        var self = this;

        this.stage = stage;
        this.parentContainer = parentContainer;

        this.shape = null;
        this.from = null;
        this.to = null;

        this.setFrom = function(from) {
            this.from = from;
            this.shape = new easeljs.Shape();

            // add to the background
            this.parentContainer.addChildAt(this.shape, 0);
        };

        this.setTo = function(to) {
            this.to = to;
            this.render();
        };

        /**
         * @param {{x: Number, y: Number}} [endPoint=to]
         */
        this.render = function(endPoint) {
            var startPoint = this.from.object.getContainer()
                .localToLocal(this.from.output.x, this.from.output.y, parentContainer);

            endPoint = endPoint || {x: this.to.input.x, y: this.to.input.y};
            endPoint.x -= this.shape.x;
            endPoint.y -= this.shape.y;

            this.shape.x = startPoint.x;
            this.shape.y = startPoint.y;

            var gfx = this.shape.graphics;
            var s = style.sizes;
            var c = style.colors;

            gfx.clear();

            gfx.beginStroke(c.connection)
                .setStrokeStyle(s.connection)
                .moveTo(0, 0)
                .lineTo(endPoint.x, endPoint.y);

            stage.update();
        };

        /**
         * Saves connection data to the model
         * and input/output objects
         */
        this.fix = function() {
            this.from.output.connection = this;
            this.to.input.connections.push(this);
        };

        this.remove = function() {
            parentContainer.removeChild(this.shape);
            stage.update();
        };

        this.getDispObj = function() {
            return this.shape;
        };
    }

    return Connection;
});