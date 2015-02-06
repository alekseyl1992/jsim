requirejs.config({
    baseUrl: '/js/lib/dev',
    paths: {
        editor: '/js/editor',
        api: '/js/api/'
    },
    shim: {
        'jquery.layout': {
            deps: [
                'jquery', 'jquery-ui'
            ]
        },
        easeljs: {
            exports: 'createjs'
        }
    }
});


// default types extensions

/**
 * Removes item from array
 * @param item - value to remove
 */
Array.prototype.remove = function (item) {
    var i;
    while((i = this.indexOf(item)) !== -1) {
        this.splice(i, 1);
    }
};