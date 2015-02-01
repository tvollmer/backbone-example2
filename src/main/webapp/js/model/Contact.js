define(function(require){

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");

    var BASE_URL = 'http://localhost:8080/backbone-example/app/Contacts';

    var Contact = Backbone.Model.extend({
        defaults: {
            photo: "img/placeholder.png",
            name: "",
            address: "",
            tel: "",
            email: "",
            type: ""
        },
        urlRoot: BASE_URL
    });

    return Contact;
});
