define(function(require){

    'use strict';

    var Directory = require("collection/Directory");
    var Contact = require("model/Contact");

    return describe("Directory", function(){

        beforeEach(function(){
            var self = this;
            self.directory = new Directory();
        });

        describe("should be able to access a variety of properties/values", function(){

            it("Directory should be a collection of Contact objects", function(){
                var self = this;
                expect( self.directory.model === Contact ).toBeTruthy();
            });

            it("urlRoot should not be null", function(){
                var self = this;
                expect( self.directory.urlRoot !== '' ).toBeTruthy();
            });

        });

    });
});