requirejs.config({
    baseUrl: '/js/lib/dev',
    paths: {
        editor: '/js/editor'
    },
    shim: {
        'jquery.layout': {
            deps: [
                'jquery', 'jquery-ui'
            ]
        },
        easeljs: {
            exports: 'createjs'
        },
        //underscore: {
        //    exports: '_'
        //}
    }
});

Array.prototype.remove = function (item) {
    var i;
    while((i = this.indexOf(item)) !== -1) {
        this.splice(i, 1);
    }
};