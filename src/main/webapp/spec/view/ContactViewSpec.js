define(function(require){

    'use strict';

    var ContactView = require("view/ContactView");
    var Contact = require("model/Contact");
    var Forms = require("utils/Forms");
    var StubEvent = require("spec/utils/StubEvent");

    describe("ContactView", function(){

        var sandbox = $('#sandbox');

        beforeEach(function(){
            var self = this;

            var forms = new Forms();
            self.contactModel = new Contact({
                photo: "img/placeholder.png",
                name: "My Name",
                address: "my address",
                tel: "98765433",
                email: "nomail@gmail.com",
                type: "friend"
            });
            var selectOfTypes = forms.createSelectOfItems(['friend', 'family', 'colleage']);
            self.contactView = new ContactView({
                model: self.contactModel,
                selectOfTypes: selectOfTypes
            });
            sandbox.html(self.contactView.render().el);

        });

        afterEach(function(){
            sandbox.remove();
        });

        function validateCommonFields(html){
            var self = this;
            var cm = self.contactModel;
            expect( html ).toNotBe( "  " );
            expect( html.indexOf(cm.get('photo')) > -1).toBeTruthy();
            expect( html.indexOf(cm.get('name')) > -1).toBeTruthy();
            expect( html.indexOf(cm.get('address')) > -1).toBeTruthy();
            expect( html.indexOf(cm.get('tel')) > -1).toBeTruthy();
            expect( html.indexOf(cm.get('email')) > -1).toBeTruthy();
            expect( html.indexOf(cm.get('type')) > -1).toBeTruthy();
        }

        describe("should be able to render values", function(){


            it("should start with rendered model within contactView, with no inputs", function(){
                var self = this;
                var html = self.contactView.$el.html();
                validateCommonFields.call(this, html);
                expect( html.indexOf("input") == -1).toBeTruthy();
            });

            it("should switch over to input fields when the edit button is clicked", function(){
                var self = this;
                self.contactView.editContactClickHandler();

                var html = self.contactView.$el.html();
                validateCommonFields.call(this, html);

                expect( html.indexOf("input") > -1).toBeTruthy();
                expect( html.indexOf("select") > -1).toBeTruthy();
                expect( html.indexOf("form") > -1).toBeTruthy();
                expect( html.indexOf("Add new") > -1).toBeTruthy();
                expect( self.contactView.cachedRefOfTypeSelect.val()).toBe( 'friend' );
            });

            it("should switch back to the initial view when the cancel button is clicked (even if the user changed a field)", function(){
                var self = this;
                var stubEvent = new StubEvent();
                self.contactView.editContactClickHandler();
                self.contactView.$(".name").val('Foo Name'); // simulate user change
                self.contactView.cancelEditClickHandler(stubEvent);

                var html = self.contactView.$el.html();
                validateCommonFields.call(this, html);

                expect( html.indexOf("input") == -1).toBeTruthy();
                expect( stubEvent.wasPreventDefaultWasCalled() ).toBeTruthy();
            });

        });

        describe("should be able to allow users to make a new 'type' when updating a model", function(){

            it("after clicking 'edit', should show the type as a select box", function(){
                var self = this;
                self.contactView.editContactClickHandler();
                expect( self.contactView.$('.type').is('select') ).toBeTruthy();
            });

            it("should change the type field to an text-input when a user selects 'Add new'", function(){
                var self = this;
                self.contactView.editContactClickHandler();
                self.contactView.cachedRefOfTypeSelect.val('addType');
                self.contactView.typeChangeUIHandler(); // need to simulate the change-event that would have fired
                expect( self.contactView.$('.type').is('input') ).toBeTruthy();
            });

            it("should keep the type field as a select when a user selects anything other than 'Add new'", function(){
                var self = this;
                self.contactView.editContactClickHandler();
                self.contactView.typeChangeUIHandler();
                expect( self.contactView.$('.type').is('select') ).toBeTruthy();

            });

        });

        describe("should do proper cleanup when the delete button is clicked", function(){

            it("should cleanup the model", function(){
                var self = this;
                spyOn(self.contactModel, "destroy");
                self.contactView.deleteContactClickHandler();
                expect(self.contactModel.destroy).toHaveBeenCalled();
            });

            it("should remove the view", function(){
                var self = this;
                spyOn(self.contactView, "remove");
                self.contactView.deleteContactClickHandler();
                expect(self.contactView.remove).toHaveBeenCalled();
            });

        });

        describe("should save the form inputs when the save button is clicked", function(){

            it("should prevent the default form submission from occurring", function(){
                var self = this;
                spyOn(self.contactModel, "save"); // don't want an actual save
                var stubEvent = new StubEvent();
                self.contactView.saveEditsClickHandler(stubEvent);
                expect(stubEvent.wasPreventDefaultWasCalled()).toBeTruthy();
            });

            it("should call model.set", function(){
                var self = this;
                spyOn(self.contactModel, "set");
                spyOn(self.contactModel, "save"); // don't want an actual save

                self.contactView.editContactClickHandler();
                var stubEventWithTarget = new StubEvent({target:self.contactView.$('.name')});
                self.contactView.saveEditsClickHandler(stubEventWithTarget);

                expect(self.contactModel.set).toHaveBeenCalledWith({
                    name: "My Name",
                    address: "my address",
                    tel: "98765433",
                    email: "nomail@gmail.com",
                    type: "friend"
                }); // deleted photo if none provided
            });

            it("should call model.save", function(){
                var self = this;
                spyOn(self.contactModel, "save");

                self.contactView.editContactClickHandler();
                var stubEventWithTarget = new StubEvent({target:self.contactView.$('.name')});
                self.contactView.saveEditsClickHandler(stubEventWithTarget);

                expect(self.contactModel.save).toHaveBeenCalled();
            });

            it("should re-render after saving", function(){
                var self = this;
                spyOn(self.contactView, "render");
                spyOn(self.contactModel, "save"); // don't want an actual save
                self.contactView.saveEditsClickHandler(new StubEvent());
                expect(self.contactView.render).toHaveBeenCalled();
            });

        });

    });
});
