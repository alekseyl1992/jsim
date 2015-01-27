
require(['libs'], function() {
    require(['jquery', 'jquery-ui', 'jquery.layout'], function() {
        $(function() {
            var $body = $('body');

            $body.layout({
                //stateManagement: {
                //    enabled: true
                //},

                defaults: {
                    resizable: false,
                    closable: false
                },
                north: {
                    size: 50
                },

                center: {
                    resizable: false,
                },

                east: {
                    size: 200,
                    childOptions: {
                        minSize: 50,
                        north: {
                            size: 100
                        }
                    }
                },

                south: {
                    closable: true,
                    slidable: true
                }
            });

            //$body.css('visibility', 'visible');

            //$("#save").button({
            //    text: false,
            //    icons: {
            //        primary: "ui-icon-disk"
            //    }
            //});
            //$("#open").button({
            //    text: false,
            //    icons: {
            //        primary: "ui-icon-folder-open"
            //    }
            //});
            //$("#new").button({
            //    text: false,
            //    icons: {
            //        primary: "ui-icon-plus"
            //    }
            //});
        });
    });
});