describe("DirectoryView", function(){

    var sandbox = $('#sandbox');

    beforeEach(function(){
        var self = this;
        var flag = false;

        require(["view/DirectoryView", "collection/Directory", "model/Contact", "utils/Forms", "Router"], function(DirectoryView, Directory, Contact, Forms, Router){
            self.directory = new Directory();
            self.directoryView = new DirectoryView({collection:self.directory});
            self.directoryView.filterType = "all";
//            self.directoryView.collection = directory;
            self.Contact = Contact;
            self.contactModel = new Contact({
                photo: "img/placeholder.png",
                name: "My Name",
                address: "my address",
                tel: "98765433",
                email: "nomail@gmail.com",
                type: "friend"
            });
            self.forms = new Forms();
            self.Router = Router;
            self.directoryView.router = new Router({directoryView:self.directoryView});
            sandbox.html(self.directoryView.render().el);
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

        it("should not have el set from within the view", function(){
            var self = this;
            expect(self.directoryView.el).toNotBe(undefined);
        });

        it("should start with rendered templates within the sandbox, with no inputs", function(){
            var self = this;
            spyOn(self.directoryView, "renderContactTypeSelect");
            var html = self.directoryView.$el.html();

            expect( html.indexOf("contacts") > -1).toBeTruthy();
            expect( html.indexOf("filter") > -1).toBeTruthy();
            expect( html.indexOf("filterType") > -1).toBeTruthy();
            expect( html.indexOf("showForm") > -1).toBeTruthy();
            expect( html.indexOf("addContactFormWrapper") > -1).toBeTruthy();

            expect( html.indexOf("form") > -1).toBeTruthy();
            expect( html.indexOf("input") > -1).toBeTruthy();
            expect( self.directoryView.$el.find('#addContact').is(":visible") ).toBeFalsy();
        });

        it("should select the correct filterType when types has values (by pre-selected)", function(){
            var self = this;
            self.directoryView.types = ['foo', 'bar', 'quox'];
            self.directoryView.render();
            self.directoryView.$el.find('#filterType').val('quox');
            self.directoryView.renderContactTypeSelect();

            expect( self.directoryView.$el.find('#filterType').val() ).toBe('quox');

        });

        it("should select the correct filterType when types has values (by filterType)", function(){
            var self = this;
            self.directoryView.types = ['foo', 'bar', 'quox'];
            self.directoryView.filterType = 'bar';
            self.directoryView.renderContactTypeSelect();

            var html = self.directoryView.$el.html();

            expect( html.indexOf("all") > -1).toBeTruthy();
            expect( html.indexOf("foo") > -1).toBeTruthy();
            expect( html.indexOf("bar") > -1).toBeTruthy();
            expect( html.indexOf("quox") > -1).toBeTruthy();

            expect( self.directoryView.$el.find('#filterType').val() ).toBe('bar');

        });

    });

    describe("should handle various renderings of a contact", function(){

        it("should be able to generate the rendering of an individual contact model ( read-only view )", function(){
            var self = this;
            var selectOfTypes = self.forms.createSelectOfItems(['foo', 'bar', 'quox']);
            var html = $(self.directoryView.renderContact(self.contactModel, selectOfTypes)).html();
            expect( html.indexOf("quox") > -1).toBeFalsy();
            expect( html.indexOf(self.contactModel.get('name')) > -1).toBeTruthy();
        });

        it("should be able to render an array of contacts", function(){
            var self = this;
            self.directoryView.types = ['foo', 'bar', 'quox'];
            self.directory.add(self.contactModel);
            self.directory.add(new self.Contact({
                photo: "img/placeholder.png",
                name: "My Other Name",
                address: "my address",
                tel: "98765433",
                email: "nomail@gmail.com",
                type: "friend"
            }));
            self.directoryView.renderContacts();
            var html = self.directoryView.$el.html();
            expect( html.indexOf(self.contactModel.get('name')) > -1).toBeTruthy();
            expect( html.indexOf("My Other Name") > -1).toBeTruthy();
        });

    });

    describe("should handle UI implementations for changing views via dropdown", function(){

        var preventDefaultWasCalled = false;
        var stubEvent = {
            preventDefault : function(){
                preventDefaultWasCalled = true;
                return false;
            },

            currentTarget : {
                value : "baz"
            }

        };

        var capturedJsonArgs = undefined;
        var stubCollection = {
            fetch : function(jsonArgs){

                capturedJsonArgs = jsonArgs;

                var nonAsyncDone = function (implementationCallBack){
                    implementationCallBack.call();
                };

                return {
                    done: nonAsyncDone
                }
            }
        };

        it("should fire filterByType with the selected value", function(){
            var self = this;
            spyOn(self.directoryView, "filterByType");
            self.directoryView.filterTypeChangeUIHandler(stubEvent);
            expect( self.directoryView.filterByType ).toHaveBeenCalledWith("baz");
        });

        it("should tell the router to navigate by the selected type", function(){
            var self = this;
            spyOn(self.directoryView.router, "navigate");
            self.directoryView.collection = stubCollection;
            self.directoryView.filterByType("mallard");
            expect(self.directoryView.router.navigate).toHaveBeenCalledWith("filter/mallard");
        });

        it("should tell the collection to fetch with the selected type", function(){
            var self = this;
            spyOn(self.directoryView.router, "navigate");
            self.directoryView.collection = stubCollection;
            self.directoryView.filterByType("mallard");
            expect(JSON.stringify(capturedJsonArgs)).toBe(JSON.stringify({data:{filterType:"mallard"}}));
        });

        it("should call render after the collection.fetch is complete", function(){
            var self = this;
            spyOn(self.directoryView.router, "navigate");
            spyOn(self.directoryView, "render");
            self.directoryView.collection = stubCollection;
            self.directoryView.filterByType("mallard");
            expect(self.directoryView.render).toHaveBeenCalled();
        });

    });

    describe("should handle form actions properly", function(){

        var preventDefaultWasCalled = false;
        var stubEvent = {
            preventDefault : function(){
                preventDefaultWasCalled = true;
                return false;
            }
        };

        it("the link's default behavior should be prevented", function(){
            var self = this;
            self.directoryView.showFormClickUIHandler(stubEvent);
            expect( preventDefaultWasCalled ).toBeTruthy();
        });

        it("should show the form when the link is clicked", function(){
            var self = this;
            expect( self.directoryView.formIsVisible ).toBeFalsy();
            self.directoryView.showFormClickUIHandler(stubEvent);
            var addContactForm = self.directoryView.$el.find('#addContact');
//            console.log("and the form was ", addContactForm.wrap("<div>").parent().html());
            waitsFor(function(){
                return addContactForm.css('display') !== 'none';
            }, "the form to be visible", 500);
        });

        it("should try to save the form values when the submit button is pressed, and once saved, should add it to the collection", function(){
            var self = this;
            /**
             * Override the save() impl at the class level with one that fires the done(Function) synchronously.
             * Also prevents the real save() from trying to persist anything to our server. ;-)
             *
             * @returns {{done: Function}}
             */
            self.Contact.prototype.save = function(){

                var nonAsyncDone = function (implementationCallBack){
                    implementationCallBack.call();
                };

                return {
                    done: nonAsyncDone
                }
            };

            spyOn(self.directoryView.collection, "add");
            self.directoryView.showFormClickUIHandler(stubEvent);
            var addContactForm = self.directoryView.$el.find('#addContact');
            waitsFor(function(){
                return addContactForm.css('display') !== 'none';
            }, "the form to be visible", 500);
            self.directoryView.addContactButtonClickHandler(stubEvent);
            expect( self.directoryView.collection.add ).toHaveBeenCalled();
        });

        it("should read the form values when the submit button is pressed, and try to save all of them with correct values", function(){
            var self = this;
            /**
             * Override the save() impl at the class level with one that fires the done(Function) synchronously.
             * Also prevents the real save() from trying to persist anything to our server. ;-)
             * Also provides a way to grab a copy of the contact that was to be saved ... all for $19.99
             *
             * @returns {{done: Function}}
             */
            var contactThatWasAttemptedToBeSaved = undefined;
            self.Contact.prototype.save = function(){

                contactThatWasAttemptedToBeSaved = this;

                var nonAsyncDone = function (implementationCallBack){
                    implementationCallBack.call();
                };

                return {
                    done: nonAsyncDone
                }
            };

            self.directoryView.showFormClickUIHandler(stubEvent);
            var addContactForm = self.directoryView.$el.find('#addContact');
            waitsFor(function(){
                return addContactForm.css('display') !== 'none';
            }, "the form to be visible", 500);

//            addContactForm.find("#photo").val(self.contactModel.get('photo')); // can't set this due to security reasons
            addContactForm.find("#type").val(self.contactModel.get('type'));
            addContactForm.find("#name").val(self.contactModel.get('name'));
            addContactForm.find("#address").val(self.contactModel.get('address'));
            addContactForm.find("#tel").val(self.contactModel.get('tel'));
            addContactForm.find("#email").val(self.contactModel.get('email'));

            self.directoryView.addContactButtonClickHandler(stubEvent);

//            expect(contactThatWasAttemptedToBeSaved.get('photo')).toBe(self.contactModel.get('photo'));
            expect(contactThatWasAttemptedToBeSaved.get('type')).toBe(self.contactModel.get('type'));
            expect(contactThatWasAttemptedToBeSaved.get('name')).toBe(self.contactModel.get('name'));
            expect(contactThatWasAttemptedToBeSaved.get('address')).toBe(self.contactModel.get('address'));
            expect(contactThatWasAttemptedToBeSaved.get('tel')).toBe(self.contactModel.get('tel'));
            expect(contactThatWasAttemptedToBeSaved.get('email')).toBe(self.contactModel.get('email'));
        });

    });

    describe("should properly define collection data handlers", function(){

        var preventDefaultWasCalled = false;
        var stubEvent = {
            preventDefault : function(){
                preventDefaultWasCalled = true;
                return false;
            }
        };

        it("collection reset handler should call render", function(){
            var self = this;
            spyOn(self.directoryView, "render");
            self.directoryView.collectionResetDataHandler(stubEvent);
            expect(self.directoryView.render).toHaveBeenCalled();
        });

        it("collection add handler should render the added model", function(){
            var self = this;
            var myThirdFriend = new self.Contact({
                photo: "img/placeholder.png",
                name: "My Third Name",
                address: "my address",
                tel: "98765433",
                email: "nomail@gmail.com",
                type: "friend"
            });
            self.directoryView.collectionAddDataHandler(myThirdFriend);

            var html = self.directoryView.$el.html();
            expect( html.indexOf("My Third Name") > -1).toBeTruthy();
        });

        it("collection add handler should NOT try to add a new type to the select if it already exists (case-insensitive)", function(){
            var self = this;
            var myThirdFriend = new self.Contact({
                photo: "img/placeholder.png",
                name: "My Third Name",
                address: "my address",
                tel: "98765433",
                email: "nomail@gmail.com",
                type: "FRIEND"
            });
            self.directoryView.types = ['foo', 'bar', 'quox', 'friend'];
            self.directoryView.render();
            spyOn(self.directoryView, "render");
            self.directoryView.collectionAddDataHandler(myThirdFriend);

            var html = self.directoryView.$el.find("#filterType").parent().html();
            expect( html.indexOf("FRIEND") > -1).toBeFalsy();
            expect(self.directoryView.render).not.toHaveBeenCalled();
        });

        it("collection add handler should try to add a new type to the select if it doesn't exist (case-insensitive), and call render for the child views", function(){
            var self = this;
            var myMentor = new self.Contact({
                photo: "img/placeholder.png",
                name: "My Middle Name",
                address: "my address",
                tel: "98765433",
                email: "nomail@gmail.com",
                type: "Mentor"
            });
            self.directoryView.types = ['foo', 'bar', 'quox'];
            self.directoryView.render();
            spyOn(self.directoryView, "render");
            self.directoryView.collectionAddDataHandler(myMentor);

            var html = self.directoryView.$el.find("#filterType").parent().html();
            expect( html.indexOf("mentor") > -1).toBeTruthy();
            expect(self.directoryView.render).toHaveBeenCalled();
            expect(_.indexOf(self.directoryView.types, 'mentor') > -1).toBeTruthy(); // lower Mentor should be added
        });

        it("collection remove hander should do very little ;-), and not cause the view/child-views to render", function(){
            var self = this;
            var myBar = new self.Contact({
                photo: "img/placeholder.png",
                name: "My Middle Name",
                address: "my address",
                tel: "98765433",
                email: "nomail@gmail.com",
                type: "bar"
            });
            self.directoryView.types = ['foo', 'bar', 'quox'];
            self.directoryView.render();
            spyOn(self.directoryView, "render");
            self.directoryView.collectionAddDataHandler(myBar);

            var html = self.directoryView.$el.find("#filterType").parent().html();
            expect( html.indexOf("bar") > -1).toBeTruthy();
            expect(self.directoryView.render).not.toHaveBeenCalled();
            expect(_.indexOf(self.directoryView.types, 'bar') > -1).toBeTruthy(); // bar should not be removed
        });

    });

});