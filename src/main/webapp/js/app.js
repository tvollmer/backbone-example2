requirejs.config({
//    baseUrl: 'js/lib',
//    paths: {
//        app: '../app'
//    },
    paths: {
        "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min",
        "json2": "//cdnjs.cloudflare.com/ajax/libs/json2/20140204/json2.min",
        "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min",
        "backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone"
    }
});


define(function(require){

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var FormUtils = require("Forms");
    var forms = new FormUtils();

    // demo data
    var contacts = [
        { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
    ];

    // model
    var Contact = Backbone.Model.extend({
        defaults: {
            photo: "img/placeholder.png",
            name: "",
            address: "",
            tel: "",
            email: "",
            type: ""
        }
    });

    // collection
    var Directory = Backbone.Collection.extend({
        model: Contact,
        getTypes: function () {
            var types = _.uniq(this.pluck("type"), false, function (type) {
                return type.toLowerCase();
            });
            _.each(types, function(value, key){
                types[key] = value.toLowerCase();
            });

            return types;
        }
    });

    // individual model view
    var ContactView = Backbone.View.extend({
        tagName: "article",
        className: "contact-container",
        template: $("#contactTemplate").html(),
        editTemplate: _.template($("#contactEditTemplate").html()),

        initialize: function(options){
//            AbstractView.prototype.initialize.apply(self, arguments);
            this.theoptions = options
        },
        render: function () {
            var tmpl = _.template(this.template);

            this.$el.html(tmpl(this.model.toJSON()));
            return this; // enable chaining
        },

        events: {
            "click button.delete": "deleteContact",
            "click button.edit": "editContact",
            "change select.type": "addType",
            "click button.save": "saveEdits",
            "click button.cancel": "cancelEdit"
        },

        deleteContact: function () {
            var removedType = this.model.get("type").toLowerCase();

            this.model.destroy();

            this.remove();

            if (_.indexOf(directory.getTypes(), removedType) === -1) {
                directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
                //contactTypeSelect.children("[value='" + removedType + "']").remove();
            }
        },

        editContact: function () {
            this.$el.html(this.editTemplate(this.model.toJSON()));

            var newOpt = $("<option/>", {
                    html: "<em>Add new...</em>",
                    value: "addType"
                });

            var selectedTypeVal = this.$el.find("#type").val().toLowerCase();
            this.select = this.theoptions.selectOfTypes.addClass("type")
                .val(selectedTypeVal).append(newOpt)
                .insertAfter(this.$el.find(".name"));

            this.$el.find("input[type='hidden']").remove();
        },

        saveEdits: function (e) {
            e.preventDefault();

            var formData = {},
                prev = this.model.previousAttributes();

            $(e.target).closest("form").find(":input").add(".photo").each(function () {

                var el = $(this);
                formData[el.attr("class")] = el.val();
            });

            if (formData.photo === "") {
                delete formData.photo;
            }

            this.model.set(formData);

            this.render();

            if (prev.photo === Contact.prototype.defaults['photo']) {
                delete prev.photo;
            }

            _.each(contacts, function (contact) {
                if (_.isEqual(contact, prev)) {
                    contacts.splice(_.indexOf(contacts, contact), 1, formData);
                }
            });
        },

        cancelEdit: function () {
            this.render(); // somehow reverts previously saved edits ( use case : edit, change, save, edit, cancel )
            // use case #2 : edit contact #1, edit contact #2, click cancel for contact #2; causes collection.onReset to fire which re-renders DirectoryView
        },

        addType: function(){
            if (this.select.val() === "addType") {
                this.select.remove();

                $("<input />", {
                    "class": "type"
                }).insertAfter(this.$el.find(".name")).focus();
            }
        }
    });

    /**
     * master view; this view is self-initializing [ initialize calls this.render() ]
     *
     */
    var DirectoryView = Backbone.View.extend({
        el: $("#contacts"), // set el once, and then you can get it a cached jquery reference with this.$el
        contactTypeSelect: null,

        initialize: function (options) {
            this.collection = options.directory;
//            this.render(); // don't need this anymore, the router/framework will invoke the render method


            this.renderContactTypeSelect();
            this.$el.find("#filter").append(contactTypeSelect);

            this.on("change:filterType", this.filterByType, this); // arbitrary change event for an undefined 'this.filterType' variable
            this.collection.on("reset", this.render, this);        // bind the render method to the collection.onReset event
            this.collection.on("add", this.renderContact, this);
            this.collection.on("remove", this.removeContact, this);
        },

        render: function () {
            var self = this;
            this.$el.find("article").remove(); // removes all of the objects/child-views with a tagName of 'article', ... which is all of our ContactView instances

            _.each(this.collection.models, function (item) {
                self.renderContact(item);
            }, this);


            return this;
        },

        renderContact: function (item) {
            var items = this.collection.getTypes();
            var selectOfTypes = forms.createSelectOfItems(items);
            var contactView = new ContactView({
                model: item,
                selectOfTypes: selectOfTypes
            });
            this.$el.append(contactView.render().el);
        },

        renderContactTypeSelect: function(){
            var items = this.collection.getTypes();
            contactTypeSelect = forms.createSelectOfItems(items, {html: "<option value='all'>All</option>"});
        },

        events: {
            "change #filter select": "setFilter", // select onChange event
            "click #add": "addContact",
            "click #showForm": "showForm"
        },

        setFilter: function (e) {
            this.filterType = e.currentTarget.value;
            this.trigger("change:filterType");
        },

        /**
         * resets collection, changes router state, and ensures that we have the correct state within the select
         */
        filterByType: function () {
            var filterType = this.filterType;
            if (filterType === "all") {
                this.collection.reset(contacts);
                contactsRouter.navigate("filter/all"); // I don't know why our view would have a reference to the router; we're changing a select & presentation, not really going to a new location
            } else {
                /*
                // orig version
                this.collection.reset(contacts, { silent: true }); // silent to keep from firing the this.collection.on("reset" event

                var filtered = _.filter(this.collection.models, function (item) {
                        return item.get("type") === filterType;
                    });
                */

                // new version
                var filtered = _.filter(contacts, function(item){
                    return filterType === item.type.toLowerCase();
                });
                this.collection.reset(filtered);
                contactsRouter.navigate("filter/" + filterType);
            }

            /**
             * added to make sure that if someone uses the back-button, that the selected-value would match the presentation/view
             */
            if ( contactTypeSelect.val() !== filterType) {
                contactTypeSelect.val(filterType);
            }
        },

        addContact: function (e) {
            e.preventDefault();

            var formData = {};
            $("#addContact").children("input").each(function (i, el) {
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });

            contacts.push(formData);

            var typeLower = formData.type.toLowerCase();
            if (_.indexOf(this.collection.getTypes(), typeLower) === -1) {
                this.collection.add(new Contact(formData));
                this.renderContactTypeSelect();
                this.$el.find("#filter").find("select").remove().end().append(contactTypeSelect);
            } else {
                this.collection.add(new Contact(formData));
            }

        },

        removeContact: function (removedModel) {
            var removed = removedModel.attributes;

            if (removed.photo === Contact.prototype.defaults['photo']) {
                delete removed.photo;
            }

            _.each(contacts, function (contact) {
                if (_.isEqual(contact, removed)) {
                    contacts.splice(_.indexOf(contacts, contact), 1);
                }
            });
        },

        showForm: function () {
            this.$el.find("#addContact").slideToggle();
        }
    });

    var ContactsRouter = Backbone.Router.extend({
        routes: {
            "": 'defaultRoute',
            "filter/:type": "urlFilter",
            "*path": 'defaultRoute'
        },

        initialize: function(options){
            var self = this;
            self.directoryView = options.directoryView
        },

        urlFilter: function (type) {
            directoryView.filterType = type;
            directoryView.trigger("change:filterType");
        },

        /**
         * define a default route; this helps to create a place holder for Backbone's history / using the back-button
         */
        defaultRoute : function(path){
            this.urlFilter('all');
        }
    });

    // create an instance of the master view [ let's get this party started!!! ]
    var directory = new Directory(contacts);
    var directoryView = new DirectoryView({directory:directory});
    var contactsRouter = new ContactsRouter({directoryView:directoryView});

    Backbone.history.start();

});