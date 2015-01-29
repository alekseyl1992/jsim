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