define(function (require) {
    var _ = require("underscore");
    var $ = require("jquery");

    function Forms(options) {
        var self = this;
        _.extend(self, options);
    }

    var prototype = Forms.prototype;

    /**
     * Creates a select that can later be added to the dom.
     *
     * EXAMPLE 1:
     *   var items = this.collection.getTypes();
     *   var contactTypeSelect = FormUtils.createSelectOfItems(items, {html: "<option value='all'>All</option>"});
     *
     * EXAMPLE 2:
     *   var items = this.collection.getTypes();
     *   var contactTypeSelect = FormUtils.createSelectOfItems(items);
     *
     * @param items
     * @param [options]
     * @returns {*|jQuery|HTMLElement}
     */
    prototype.createSelectOfItems = function (items, options) {
        var select = $("<select/>", options);
        var optsArray = prototype.createOptions(items);
        return select.append(optsArray);
    };


    /**
     * Creates an array of options that can be appended to a DOM elem.
     *
     * EXAMPLE 1 ( provide initial array of string ):
     *   var items = this.collection.getTypes();
     *   var options = forms.createOptions(items, ["<option value='all'>All</option>"]);
     *   self.contactTypeSelect.find('option').remove().end().append(options);
     *
     * EXAMPLE 2 ( provide and initial array of jQuery objects ):
     *   var items = this.collection.getTypes();
     *   var options = forms.createOptions(items, [$("<option/>", {value:"all",text:"All"})]);
     *   self.contactTypeSelect.find('option').remove().end().append(options);
     *
     * EXAMPLE 3 ( no starting array ):
     *   var items = this.collection.getTypes();
     *   var options = forms.createOptions(items);
     *   self.contactTypeSelect.find('option').remove().end().append(options);
     *
     * @param items
     * @param [initialOptionsArray]
     * @returns {*|Array}
     */
    prototype.createOptions = function(items, initialOptionsArray){
        var options = initialOptionsArray || [];
        _.each(items, function (item) {
            options.push(prototype.createOption(item));
        });
        return options;
    };

    /**
     * Creates a single option element/object.
     *
     * @param item
     * @returns {*|jQuery|HTMLElement}
     */
    prototype.createOption = function(item){
        return $("<option/>", {
            value: item,
            text: item
        });
    };

    return Forms;
});