requirejs.config({
    baseUrl: '/js/lib/dev',
    paths: {
        editor: '/js/editor',
        api: '/js/api/',
        util: '/js/util/'
    },
    shim: {
        'jquery.layout': {
            deps: [
                'jquery', 'jquery-ui'
            ]
        },
        'jquery.flot': {
            deps: [
                'jquery'
            ]
        },
        'jquery.flot.axislabels': {
            deps: [
                'jquery.flot'
            ]
        },
        'bootstrap-table.ru': {
            deps: [
                'jquery',
                'bootstrap-table'
            ]
        },
        'bootstrap-table': {
            deps: [
                'jquery'
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

/**
 * Adds all elements from arr
 * @param arr {Array}
 */
Array.prototype.pushArray = function(arr) {
    this.push.apply(this, arr);
};