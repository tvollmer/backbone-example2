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
            this.theoptions = options;
        },
        render: function () {
            var tmpl = _.template(this.template);

            this.$el.html(tmpl(this.model.toJSON()));
            return this; // enable chaining
        },

        events: {
            "click button.delete": "deleteContactClickHandler",
            "click button.edit": "editContactClickHandler",
            "click button.save": "saveEditsClickHandler",
            "click button.cancel": "cancelEditClickHandler",
            "change select.type": "addTypeChangeUIHandler"
        },

        deleteContactClickHandler: function (event) {
            this.model.destroy();
            this.remove();
        },

        editContactClickHandler: function (event) {
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

        saveEditsClickHandler: function (event) {
            event.preventDefault();

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

        cancelEditClickHandler: function (event) {
            this.render(); // somehow reverts previously saved edits ( use case : edit, change, save, edit, cancel )
            // use case #2 : edit contact #1, edit contact #2, click cancel for contact #2; causes collection.onReset to fire which re-renders DirectoryView
        },

        addTypeChangeUIHandler: function(event){
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
        contactTypeSelect: $("#filterType"),

        initialize: function (options) {
            this.collection = options.directory;

            this.collection.on("reset", this.collectionResetDataHandler, this);        // bind the render method to the collection.onReset event
            this.collection.on("add", this.colletionAddDataHandler, this);
            this.collection.on("remove", this.collectionRemoveDataHandler, this);

            this.renderContactTypeSelect();
        },

        collectionResetDataHandler: function(e){
            this.render(e);
        },

        colletionAddDataHandler: function(addedModel){
            this.renderContact(addedModel)
        },

        render: function () {
            var self = this;
            this.$el.find("article").remove();

            _.each(this.collection.models, function (item) {
                self.renderContact(item);
            }, this);

            return this;
        },

        renderContact: function (contactModel) {
            var items = this.collection.getTypes();
            var selectOfTypes = forms.createSelectOfItems(items);
            var contactView = new ContactView({
                model: contactModel,
                selectOfTypes: selectOfTypes
            });
            this.$el.append(contactView.render().el);
        },

        renderContactTypeSelect: function(){
            var self = this;
            var items = this.collection.getTypes();
            var tmpSelect = forms.createSelectOfItems(items, {html: "<option value='all'>All</option>"});
            self.contactTypeSelect.find('option').remove();
            _.each(tmpSelect.find('option'), function(option){
                self.contactTypeSelect.append(option);
            });
        },

        events: {
            "change #filter select": "setFilter", // select onChange event
            "click #add": "addContactButtonClickHandler",
            "click #showForm": "showFormClickUIHandler",
            "change #filterType": "filterTypeChangeUIHandler"
        },

        setFilter: function (e) {
            this._filterType = e.currentTarget.value;
            this.trigger("change:filterType");
        },

        filterTypeChangeUIHandler: function(e){
            var self = this;
            var filterType = self._filterType;
            self.filterByType(filterType);
        },

        /**
         * resets collection, changes router state, and ensures that we have the correct state within the select
         */
        filterByType: function (filterType) {
            var self = this;
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
            if ( self.contactTypeSelect.val() !== filterType) {
                self.contactTypeSelect.val(filterType);
            }
        },

        addContactButtonClickHandler: function (e) {
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
            } else {
                this.collection.add(new Contact(formData));
            }

        },

        collectionRemoveDataHandler: function (removedModel) {
            var self = this;
            var removed = removedModel.attributes;
            var removedType = removed.type.toLowerCase();

            if (removed.photo === Contact.prototype.defaults['photo']) {
                delete removed.photo;
            }

            _.each(contacts, function (contact) {
                if (_.isEqual(contact, removed)) {
                    contacts.splice(_.indexOf(contacts, contact), 1);
                }
            });

            if (_.indexOf(this.collection.getTypes(), removedType) === -1) {
                self.contactTypeSelect.children("[value='" + removedType + "']").remove();
                self.contactTypeSelect.val('all').trigger('change');
            }
        },

        showFormClickUIHandler: function (e) {
            e.preventDefault();
            var self = this;
            var addContactForm = this.$el.find("#addContact");
            if ( !self.formIsVisible ){
                addContactForm.slideToggle(function(){
                    self.formIsVisible = true;
                });
            }
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
            directoryView.filterByType(type);
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