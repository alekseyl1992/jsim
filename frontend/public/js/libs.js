requirejs.config({
    baseUrl: '/js/lib/dev',
    paths: {
        app: '/js/editor'
    },
    shim: {
        'jquery.layout': {
            deps: [
                'jquery', 'jquery-ui'
            ]
        }
        //backbone: {
        //    deps: ['jquery', 'underscore'],
        //    exports: 'Backbone'
        //},
        //underscore: {
        //    exports: '_'
        //}
    }
});