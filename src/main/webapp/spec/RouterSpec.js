describe("Router", function(){

    var typeArg = undefined;
    var stubDirectoryView = {

        filterByType : function(type){
            typeArg = type;
        }

    };

    beforeEach(function(){
        var self = this;
        var flag = false;

        require(["Router"], function(Router){
            self.router = new Router({directoryView:stubDirectoryView});
            flag = true;
        });

        waitsFor(function() {
            return flag;
        });

    });

    describe("should set options on initialization", function(){

        it("should set directoryView", function(){
            var self = this;
            expect( self.router.directoryView ).toBe(stubDirectoryView);
        });

    });

    describe("should be able delegate to filterByType", function(){

        it("should return the supplied name", function(){
            var self = this;
            self.router.urlFilter("Some Type");
            expect( typeArg ).toBe('Some Type');
        });

        it("should handle a default route", function(){
            var self = this;
            spyOn(self.router, "urlFilter");
            self.router.defaultRoute("foo route");
            expect(self.router.urlFilter).toHaveBeenCalledWith('all');
        });

    });

});