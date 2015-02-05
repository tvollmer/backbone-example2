define(function(require){

    'use strict';

    var Directory = require("collection/Directory");
    var Contact = require("model/Contact");

    return describe("Contacts", function(){

        beforeEach(function(){
            var self = this;
            self.contact = new Contact({name:"foo"});
        });

        describe("should be able to access a variety of properties/values", function(){

            it("should return the supplied name", function(){
                var self = this;
                expect( self.contact.get('name') ).toBe('foo');
            });

            it("urlRoot should not be null", function(){
                var self = this;
                expect( self.contact.urlRoot !== '' ).toBeTruthy();
            });

            it("the default for photo should be accessable for the views", function(){
                var self = this;
                expect( Contact.prototype.defaults['photo'] ).toBe("img/placeholder.png");
            });

        });

    });
});