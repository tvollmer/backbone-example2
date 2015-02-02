describe("ContactView", function(){

    var sandbox = $('#sandbox');

    beforeEach(function(){
        var self = this;
        var flag = false;

        require(["view/ContactView", "model/Contact", "utils/Forms"], function(ContactView, Contact, Forms){
            var forms = new Forms();
            var contactModel = new Contact({
                photo: "img/placeholder.png",
                name: "My Name",
                address: "my address",
                tel: "98765433",
                email: "nomail@gmail.com",
                type: "friend"
            });
            var selectOfTypes = forms.createSelectOfItems(['friend', 'family', 'colleage']);
            self.contactView = new ContactView({
                model: contactModel,
                selectOfTypes: selectOfTypes
            });
            sandbox.html(self.contactView.render().el);
            flag = true;
        });

        waitsFor(function() {
            return flag;
        });

    });

    afterEach(function(){
        sandbox.remove();
    });

    describe("should be able to render values", function(){

        it("should start with rendered model within contactView, with no inputs", function(){
            var self = this;
            var html = self.contactView.$el.html();
            expect( html ).toNotBe( "  " );
            expect( html.indexOf("placeholder.png") > -1).toBeTruthy();
            expect( html.indexOf("My Name") > -1).toBeTruthy();
            expect( html.indexOf("my address") > -1).toBeTruthy();
            expect( html.indexOf("98765433") > -1).toBeTruthy();
            expect( html.indexOf("nomail@gmail.com") > -1).toBeTruthy();
            expect( html.indexOf("friend") > -1).toBeTruthy();

            expect( html.indexOf("input") == -1).toBeTruthy();
        });

        it("should switch over to input fields when the edit button is clicked", function(){
            var self = this;
            self.contactView.editContactClickHandler();

            var html = self.contactView.$el.html();
            expect( html ).toNotBe( "  " );
            expect( html.indexOf("placeholder.png") > -1).toBeTruthy();
            expect( html.indexOf("My Name") > -1).toBeTruthy();
            expect( html.indexOf("my address") > -1).toBeTruthy();
            expect( html.indexOf("98765433") > -1).toBeTruthy();
            expect( html.indexOf("nomail@gmail.com") > -1).toBeTruthy();
            expect( html.indexOf("friend") > -1).toBeTruthy();

            expect( html.indexOf("input") > -1).toBeTruthy();
            expect( html.indexOf("select") > -1).toBeTruthy();
            expect( html.indexOf("form") > -1).toBeTruthy();
            expect( html.indexOf("Add new") > -1).toBeTruthy();
            expect( self.contactView.cachedRefOfTypeSelect.val()).toBe( 'friend' );
        });

        it("should switch back to the initial view when the cancel button is clicked", function(){
            var self = this;
            var preventDefaultWasCalled = false;
            var stubEvent = {
                preventDefault : function(){
                    preventDefaultWasCalled = true;
                    return false;
                }
            };
            self.contactView.editContactClickHandler();
            self.contactView.cancelEditClickHandler(stubEvent);

            var html = self.contactView.$el.html();
            expect( html ).toNotBe( "  " );
            expect( html.indexOf("placeholder.png") > -1).toBeTruthy();
            expect( html.indexOf("My Name") > -1).toBeTruthy();
            expect( html.indexOf("my address") > -1).toBeTruthy();
            expect( html.indexOf("98765433") > -1).toBeTruthy();
            expect( html.indexOf("nomail@gmail.com") > -1).toBeTruthy();
            expect( html.indexOf("friend") > -1).toBeTruthy();

            expect( html.indexOf("input") == -1).toBeTruthy();
            expect( preventDefaultWasCalled ).toBeTruthy();
        });

    });

    describe("should be able to allow users to make a new 'type' when updating a model", function(){

        it("after clicking 'edit', should show the type as a select box", function(){
            var self = this;
            self.contactView.editContactClickHandler();
            expect( self.contactView.$el.find('.type').is('select') ).toBeTruthy();
        });

        it("should change the type field to an text-input when a user selects 'Add new'", function(){
            var self = this;
            self.contactView.editContactClickHandler();
            self.contactView.cachedRefOfTypeSelect.val('addType');
            self.contactView.typeChangeUIHandler(); // need to simulate the change-event that would have fired
            expect( self.contactView.$el.find('.type').is('input') ).toBeTruthy();
        });

        it("should keep the type field as a select when a user selects anything other than 'Add new'", function(){
            var self = this;
            self.contactView.editContactClickHandler();
            self.contactView.typeChangeUIHandler();
            expect( self.contactView.$el.find('.type').is('select') ).toBeTruthy();

        });

    });

    // TODO: write tests for deleteContactClickHandler
    // TODO: write tests for saveEditsClickHandler
});