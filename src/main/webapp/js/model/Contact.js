define(function(require){

    'use strict';

    var Backbone = require('backbone');

    var BASE_URL = 'app/Contacts';

    var Contact = Backbone.Model.extend({
        defaults: {
            photo: 'img/placeholder.png',
            name: '',
            address: '',
            tel: '',
            email: '',
            type: ''
        },
        urlRoot: BASE_URL
    });

    return Contact;
});
