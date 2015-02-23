define(['easeljs'], function(easeljs) {
    var Connection = Class.create({
        initialize: function (stage, parentContainer, style) {
            this.stage = stage;
            this.parentContainer = parentContainer;
            this.style = style;

            this.shape = null;
            this.from = null;
            this.to = null;
        },

        setFrom: function(from) {
            this.from = from;
            this.shape = new easeljs.Shape();

            // add to the background
            this.parentContainer.addChildAt(this.shape, 0);
        },

        getFrom: function() {
            return this.from;
        },

        setTo: function(to) {
            this.to = to;
            this.render();
        },

        getTo: function() {
            return this.to;
        },

        /**
         * @param {{x: Number, y: Number}} [endPoint=to]
         */
        render: function(endPoint) {
            var startPoint = this.from.object.getContainer()
                .localToLocal(this.from.output.x, this.from.output.y, this.parentContainer);

            this.shape.x = startPoint.x;
            this.shape.y = startPoint.y;

            endPoint = endPoint || this.to.object.getContainer()
                .localToLocal(this.to.input.x, this.to.input.y, this.parentContainer);

            var gfx = this.shape.graphics;
            var s = this.style.sizes;
            var c = this.style.colors;

            gfx.clear();

            this._roundingRender(gfx, s, c, endPoint);

            this.stage.update();
        },

        _directRender: function(gfx, s, c, endPoint) {
            gfx.beginStroke(c.connection)
                .setStrokeStyle(s.connection)
                .moveTo(0, 0)
                .lineTo(endPoint.x - this.shape.x, endPoint.y - this.shape.y);

            var angle = Math.atan2(endPoint.x - this.shape.x, endPoint.y - this.shape.y);
            this._renderArrow(gfx, s, c, endPoint.x - this.shape.x, endPoint.y - this.shape.y, angle);
        },

        _roundingRender: function(gfx, s, c, endPoint) {
            // step 1: trace from start to end and find obstacles
            var obstacles = [];

            var maxY = -Infinity;
            var minY = +Infinity;

            var start = {
                x: this.shape.x,
                y: this.shape.y
            };
            var end = endPoint;

            // step size is independent from distance
            var step = s.connectionProbeStep;
            var positiveStep = step;

            if (start.x > end.x)
                step = -step;

            if (start.x - end.x < step)
                return this._directRender(gfx, s, c, endPoint);

            var lineFun = function(x) {
                return (x - start.x) / (end.x - start.x) * (end.y - start.y) + start.y;
            };

            for (var point = _.clone(start);
                 point.x - end.x > step;
                 point.x += step, point.y = lineFun(point.x)) {

                var obstacle = this.parentContainer.getObjectUnderPoint(point.x, point.y);
                if (obstacle && obstacle.parent && obstacle.parent.jsimObject) {
                    var jsimObject = obstacle.parent.jsimObject;

                    // if that is new object
                    if (_.indexOf(obstacles, jsimObject) == -1) {
                        var pos = obstacle.parent.jsimObject.getPos();
                        if (pos.y > maxY)
                            maxY = pos.y;
                        if (pos.y < minY)
                            minY = pos.y;

                        obstacles.push(obstacle.parent.jsimObject);
                    }
                }
            }

            // step 2: analyze
            // if the are no obstacles - just use _directRender()
            if (obstacles.length === 0)
                return this._directRender(gfx, s, c, endPoint);

            // else - decide to go lower or higher
            var path = [];

            // first point should be a bit to the right of the start
            var first = {
                x: start.x + positiveStep,
                y: start.y
            };
            path.push(first);

            // last point should be a bit to the left of the end
            var last = {
                x: end.x - positiveStep,
                y: end.y
            };  // don't push right now

            // calculate middle two points
            var middleFirst, middleLast;  // i want 'let' to be part of JS right now :(

            var avgY = (start.y + end.y) / 2;
            if (maxY + s.h - avgY < avgY - minY) {  // go higher
                middleFirst = {
                    x: first.x,
                    y: maxY + s.h + positiveStep
                };

                middleLast = {
                    x: last.x,
                    y: maxY + s.h + positiveStep
                };
            } else {  // go lower
                middleFirst = {
                    x: first.x,
                    y: minY - positiveStep
                };

                middleLast = {
                    x: last.x,
                    y: minY - positiveStep
                };
            }
            path.push(middleFirst);
            path.push(middleLast);

            path.push(last);
            path.push(end);

            // step 3: render path
            gfx.beginStroke(c.connection)
                .setStrokeStyle(s.connection)
                .moveTo(0, 0);  // we at start already

            _.each(path, function(point) {
                gfx.lineTo(point.x - start.x, point.y - start.y);
            });

            this._renderArrow(gfx, s, c, end.x - start.x, end.y - start.y, Math.PI / 2);
        },

        _renderArrow: function(gfx, s, c, x, y, angle) {
            gfx.beginStroke(c.connection);
            gfx.setStrokeStyle(s.connection);

            var angleA = -angle - s.connectionArrowAngle - Math.PI / 2;
            var angleB = -angle + s.connectionArrowAngle - Math.PI / 2;


            gfx.moveTo(x, y);
            gfx.lineTo(x + s.connectionArrowLen * Math.cos(angleA), y + s.connectionArrowLen * Math.sin(angleA));

            gfx.moveTo(x, y);
            gfx.lineTo(x + s.connectionArrowLen * Math.cos(angleB), y + s.connectionArrowLen * Math.sin(angleB));
        },

        /**
         * Saves connection data to the model
         * and input/output objects
         */
        fix: function() {
            this.from.object.addConnection(this);
            this.to.object.addConnection(this);
        },

        remove: function() {
            // disconnect from source
            if (this.from)
                this.from.object.removeConnection(this);

            // disconnect from target
            if (this.to)
                this.to.object.removeConnection(this);

            // remove from stage
            this.parentContainer.removeChild(this.shape);
            this.stage.update();
        },

        getDispObj: function() {
            return this.shape;
        }
    });

    return Connection;
});