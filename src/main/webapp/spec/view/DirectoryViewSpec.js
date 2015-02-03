describe("DirectoryView", function(){

    var sandbox = $('#sandbox');

    beforeEach(function(){
        var self = this;
        var flag = false;

        require(["view/DirectoryView", "collection/Directory"], function(DirectoryView, Directory){
            var directory = new Directory();
            self.directoryView = new DirectoryView({collection:directory});
            self.directoryView.filterType = "all";
            self.directoryView.collection = directory;
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

    // TODO : way more tests ...
    
});