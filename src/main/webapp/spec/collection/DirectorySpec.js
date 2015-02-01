describe("Directory", function(){

    beforeEach(function(){
        var self = this;
        var flag = false;

        require(["collection/Directory", "model/Contact"], function(Directory, Contact){
            self.directory = new Directory();
            self.Directory = Directory;
            self.Contact = Contact;
//            $('#sandbox').html(self.view.render().el);
            flag = true;
        });

        waitsFor(function() {
            return flag;
        });

    });

    describe("should be able to access a variety of properties/values", function(){

        it("Directory should be a collection of Contact objects", function(){
            var self = this;
            expect( self.directory.model === self.Contact ).toBeTruthy();
        });

        it("urlRoot should not be null", function(){
            var self = this;
            expect( self.directory.urlRoot !== '' ).toBeTruthy();
        });

    });

});