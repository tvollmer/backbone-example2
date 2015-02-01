requirejs.config({
//    baseUrl: 'js/lib',
//    paths: {
//        app: '../app'
//    },
    paths: {
        "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min",
        "json2": "//cdnjs.cloudflare.com/ajax/libs/json2/20140204/json2.min",
        "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min",
        "backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone"
    }
});

require(['app'], function(App){
    App.start();
});