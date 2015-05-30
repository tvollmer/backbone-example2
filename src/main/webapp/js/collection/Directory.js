define(function(require){

    'use strict';

    var Backbone = require('backbone');
    var $ = require('jquery');

    var BASE_URL = 'app/Contacts';
    var Contact = require('model/Contact');

    var Directory = Backbone.Collection.extend({
        model: Contact,
        url: BASE_URL,
        getAllTypes:function(callBack){
            $.getJSON(BASE_URL+'/types')
                .done(callBack);
        }
    });

    return Directory;
});
