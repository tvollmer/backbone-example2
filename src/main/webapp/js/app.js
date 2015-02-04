define(function(require){

    'use strict';

    var Backbone = require('backbone');

    var start = function(){

        var Directory = require('collection/Directory');
        var DirectoryView = require('view/DirectoryView');
        var ContactsRouter = require('Router');

        var directory = new Directory();
        var directoryView = new DirectoryView({el:'#container', collection:directory});
        var contactsRouter = new ContactsRouter({directoryView:directoryView});
        directoryView.router = contactsRouter;

        Backbone.history.start();

    };

    return {
        start: start
    };
});