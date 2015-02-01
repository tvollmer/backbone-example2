// See http://stackoverflow.com/a/22745553/14731
var scripts = document.getElementsByTagName('script');
var thisScriptTag = scripts[ scripts.length - 1 ];
var dataMain = thisScriptTag.getAttribute("data-main");

require.config({
    baseUrl: "js",
    urlArgs: 'cb=' + Math.random(),
    paths: {
        "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min",
        "json2": "//cdnjs.cloudflare.com/ajax/libs/json2/20140204/json2.min",
        "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min",
        "backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone",
        spec: '../spec/'
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

if (dataMain)
    require([dataMain]);