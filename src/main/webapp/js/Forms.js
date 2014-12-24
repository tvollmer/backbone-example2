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
     * @param options
     * @returns {*|jQuery|HTMLElement}
     */
    prototype.createSelectOfItems = function (items, options) {
        var select = $("<select/>", options);

        _.each(items, function (item) {
            prototype.createOption(item).appendTo(select);
        });
        return select;
    };

    prototype.createOption = function(item){
        return $("<option/>", {
            value: item,
            text: item
        });
    };

    return Forms;
});