define(function(require){

    'use strict';

    var Backbone = require('backbone');

    var Router = Backbone.Router.extend({
        routes: {
            '': 'defaultRoute',
            'filter/:type': 'urlFilter',
            '*path': 'defaultRoute'
        },

        initialize: function(options){
            var self = this;
            self.directoryView = options.directoryView;
        },

        urlFilter: function (type) {
            var self = this;
            self.directoryView.filterByType(type);
        },

        /**
         * define a default route; this helps to create a place holder for Backbone's history / using the back-button
         */
        defaultRoute : function(path){
            this.urlFilter('all');
        }
    });

    return Router;
});