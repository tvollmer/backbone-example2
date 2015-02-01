define(function(require){

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");

    var BASE_URL = 'http://localhost:8080/backbone-example/app/Contacts';
    var Contact = require("model/Contact");

    var Directory = Backbone.Collection.extend({
        model: Contact,
        url: BASE_URL
    });

    return Directory;
});
