describe("Contacts", function(){

    beforeEach(function(){
        var self = this;
        var flag = false;

        require(["model/Contact"], function(Contact){
            self.contact = new Contact({name:"foo"});
            self.Contact = Contact;
//            $('#sandbox').html(self.view.render().el);
            flag = true;
        });

        waitsFor(function() {
            return flag;
        });

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
            expect( self.Contact.prototype.defaults['photo'] ).toBe("img/placeholder.png");
        });

    });

});