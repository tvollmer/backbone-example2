define(function(require){

    'use strict';

    var Forms = require("utils/Forms");
    var fooOption = '<option value="foo">foo</option>';
    var fooBarOption = '<option value="foo">bar</option>';
    var allOption = '<option value="all">All</option>';

    describe("Forms", function(){

        beforeEach(function(){
            var self = this;
            self.formUtils = new Forms();
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
                expect( option.wrap('<div>').parent().html() ).toBe( fooOption );
            });

            it("should work with two args", function(){
                var self = this;
                var option = self.formUtils.createOption("foo", "bar");
                expect( option.wrap('<div>').parent().html() ).toBe( fooBarOption );
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
                expect( options[0].wrap('<div>').parent().html() ).toBe( fooOption );
            });

            it("should work with one item in an array and supplied initial items", function(){
                var self = this;
                var options = self.formUtils.createOptions(["foo"], [$(allOption)]);
                expect( options.length === 2).toBeTruthy();
                expect( options[0].wrap('<div>').parent().html() ).toBe( allOption );
                expect( options[1].wrap('<div>').parent().html() ).toBe( fooOption );
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
                expect( select.wrap('<div>').parent().html() ).toBe( '<select>'+fooOption+'</select>' );
            });

            it("should work with one item in an array and supplied initial html", function(){
                var self = this;
                var select = self.formUtils.createSelectOfItems(["foo"],{html: allOption});
                expect( select.wrap('<div>').parent().html() ).toBe( '<select>'+allOption+fooOption+'</select>' );
            });

        });

    });
});
