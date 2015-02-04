define(function(require){

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var App = require("app");

    return describe("App", function(){

        beforeEach(function(){
            var self = this;
        });

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

