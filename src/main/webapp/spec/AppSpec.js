define(function(require){

    'use strict';

    var Backbone = require("backbone");
    var App = require("app");

    describe("App", function(){

        describe("should set options on initialization", function(){

            it("should start history", function(){
                var self = this;
                spyOn(Backbone.history, "start");
                App.start();
                expect( Backbone.history.start ).toHaveBeenCalled();
            });

        });

    });
});

