describe("Forms", function(){

    beforeEach(function(){
        var self = this;
        var flag = false;

        require(["utils/Forms"], function(Forms){
            self.formUtils = new Forms();
//            $('#sandbox').html(self.view.render().el);
            flag = true;
        });

        waitsFor(function() {
            return flag;
        });

    });

    describe('createOption should return option element', function(){
        it("should return a jquery object", function(){
            var self = this;
            var option = self.formUtils.createOption("foo");
            expect( option instanceof jQuery ).toBeTruthy();
        });

        it("should work with one arg", function(){
            var self = this;
            var option = self.formUtils.createOption("foo");
            expect( option.wrap('<div>').parent().html() ).toBe( '<option value="foo">foo</option>' );
        });

        it("should work with two args", function(){
            var self = this;
            var option = self.formUtils.createOption("foo", "bar");
            expect( option.wrap('<div>').parent().html() ).toBe( '<option value="foo">bar</option>' );
        });

    });

    describe('createOptions should return option elements', function(){
        it("should return a jquery object", function(){
            var self = this;
            var options = self.formUtils.createOptions(["foo"]);
            expect( options instanceof Array ).toBeTruthy();
        });

        it("should work with one item in an array", function(){
            var self = this;
            var options = self.formUtils.createOptions(["foo"]);
            expect( options[0].wrap('<div>').parent().html() ).toBe( '<option value="foo">foo</option>' );
        });

        it("should work with one item in an array and supplied initial items", function(){
            var self = this;
            var options = self.formUtils.createOptions(["foo"], [$('<option value="all">All</option>')]);
            expect( options.length === 2).toBeTruthy();
            expect( options[0].wrap('<div>').parent().html() ).toBe( '<option value="all">All</option>' );
            expect( options[1].wrap('<div>').parent().html() ).toBe( '<option value="foo">foo</option>' );
        });

    });

    describe('createSelectOfItems should return a select object', function(){
        it("should return a jquery object", function(){
            var self = this;
            var select = self.formUtils.createSelectOfItems(["foo"]);
            expect( select instanceof jQuery ).toBeTruthy();
        });

        it("should work with one arg", function(){
            var self = this;
            var select = self.formUtils.createSelectOfItems(["foo"]);
            expect( select.wrap('<div>').parent().html() ).toBe( '<select><option value="foo">foo</option></select>' );
        });

        it("should work with one item in an array and supplied initial html", function(){
            var self = this;
            var select = self.formUtils.createSelectOfItems(["foo"],{html: "<option value='all'>All</option>"});
            expect( select.wrap('<div>').parent().html() ).toBe( '<select><option value="all">All</option><option value="foo">foo</option></select>' );
        });

    });

});
