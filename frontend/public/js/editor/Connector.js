define(['easeljs', 'editor/Connection'], function(easeljs, Connection) {
    function Connector(stage, parentContainer, style) {
        var self = this;
        this.parentContainer = parentContainer;
        this.stage = stage;

        var from = null;
        var to = null;

        var connection = null;

        this.setFrom = function(fromObject, output) {
            from = {
                object: fromObject,
                output: output
            };

            var pt = fromObject.getContainer().localToLocal(output.x, output.y, parentContainer);

            connection = new easeljs.Shape();
            connection.x = pt.x;
            connection.y = pt.y;

            this.parentContainer.addChildAt(connection, 0);
        };

        this.move = function(x, y) {
            var gfx = connection.graphics;
            var s = style.sizes;
            var c = style.colors;

            gfx.clear();

            gfx.beginStroke(c.connection)
                .setStrokeStyle(s.connection)
                .moveTo(0, 0)
                .lineTo(x - connection.x, y - connection.y);

            stage.update();
        };

        this.setTo = function(toObject, input) {
            from = {
                object: toObject,
                input: input
            };
        };

        this.createConnection = function() {
            console.log("Connection created: ", from, to);

            var connectionObject = new Connection(from, to, connection);
            from.output.connection = connectionObject;
            to.input.connections.push(connectionObject);

            from = to = null;
        };
    }

    return Connector;
});