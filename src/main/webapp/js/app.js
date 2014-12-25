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
    var contactsData = [
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

    // viewableCollection
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
            this.selectOfTypes = options.selectOfTypes;
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

            var nameElem = this.$el.find(".name");
            var typeElem = this.$el.find("#type");
            var selectedTypeVal = typeElem.val().toLowerCase();
            typeElem.remove();

            var newOpt = forms.createOption("addType", "<em>Add new...</em>");
            this.cachedRefOfTypeSelect = this.selectOfTypes.clone().addClass("type")
                .val(selectedTypeVal).append(newOpt)
                .insertAfter(nameElem);
        },

        saveEditsClickHandler: function (event) {
            event.preventDefault();

            var formData = {};
            $(event.target).closest("form").find(":input").add(".photo").each(function () {
                var el = $(this);
                formData[el.attr("class")] = el.val();
            });

            if (formData.photo === "") {
                delete formData.photo;
            }

            this.model.set(formData);
            var prev = this.model.previousAttributes();

            this.render();

            if (prev.photo === Contact.prototype.defaults['photo']) {
                delete prev.photo;
            }


            _.each(contactsData, function (contact, index) {
                if (_.isEqual(contact, prev)) {
                    contactsData.splice(index, 1, formData);
                }
            });
        },

        cancelEditClickHandler: function (event) {
            event.preventDefault();
            this.render(); // somehow reverts previously saved edits ( use case : edit, change, save, edit, cancel )
            // use case #2 : edit contact #1, edit contact #2, click cancel for contact #2; causes viewableCollection.onReset to fire which re-renders DirectoryView
        },

        addTypeChangeUIHandler: function(event){
            if (this.cachedRefOfTypeSelect.val() === "addType") {
                this.cachedRefOfTypeSelect.remove();

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
            this.viewableCollection = options.directory;

            this.types = this.viewableCollection.getTypes();

            this.viewableCollection.on("reset", this.collectionResetDataHandler, this);
            this.viewableCollection.on("add", this.colletionAddDataHandler, this);
            this.viewableCollection.on("remove", this.collectionRemoveDataHandler, this);

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
            // TODO: can be optimized to reduce redraws ( ie. create the new views, remove the old, and append them all at once [not in a loop] )
            this.$el.find("article").remove();

            _.each(this.viewableCollection.models, function (item) {
                self.renderContact(item, self.types);
            }, this);

            return this;
        },

        renderContact: function (contactModel, initialTypes) {
            var self = this;
            var selectOfTypes = forms.createSelectOfItems(self.types);
            var contactView = new ContactView({
                model: contactModel,
                selectOfTypes: selectOfTypes
            });
            this.$el.append(contactView.render().el);
        },

        /**
         * should only be called during initialization, or when reseting the viewableCollection to its broadest scope
         */
        renderContactTypeSelect: function(){
            var self = this;
            var options = forms.createOptions(self.types, ["<option value='all'>All</option>"]);
            self.contactTypeSelect.find('option').remove().end().append(options);
        },

        events: {
            "click #add": "addContactButtonClickHandler",
            "click #showForm": "showFormClickUIHandler",
            "change #filterType": "filterTypeChangeUIHandler"
        },

        filterTypeChangeUIHandler: function(e){
            var self = this;
            var filterType = e.currentTarget.value;
            self.filterByType(filterType);
        },

        /**
         * resets viewable viewableCollection, changes router state, and ensures that we have the correct state within the select
         *
         * Honestly, this function feels more like Controller logic.
         *
         */
        filterByType: function (filterType) {
            var self = this;
            if (filterType === "all") {
                this.viewableCollection.reset(contactsData);
                contactsRouter.navigate("filter/all"); // I don't know why our view would have a reference to the router; we're changing a select & presentation, not really going to a new location
            } else {
                var filtered = _.filter(contactsData, function(item){
                    return filterType === item.type.toLowerCase();
                });
                this.viewableCollection.reset(filtered);
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
            var self = this;

            var formData = {};
            $("#addContact").children("input").each(function (i, el) {
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });

            // FIXME : this view already has access to the Directory, which has a reference/copy of the main collection; this view shouldn't need direct access to the main collection
            contactsData.push(formData);

            var typeLower = formData.type.toLowerCase();
            if (_.indexOf(self.types, typeLower) === -1) {
                this.viewableCollection.add(new Contact(formData));
                self.types.push(typeLower);
                forms.createOption(typeLower).appendTo(self.contactTypeSelect)
            } else {
                this.viewableCollection.add(new Contact(formData));
            }

        },

        collectionRemoveDataHandler: function (removedModel) {
            var self = this;
            var removed = removedModel.attributes;
            var removedType = removed.type.toLowerCase();

            if (removed.photo === Contact.prototype.defaults['photo']) {
                delete removed.photo;
            }

            _.each(contactsData, function (contact) {
                if (_.isEqual(contact, removed)) {
                    contactsData.splice(_.indexOf(contactsData, contact), 1);
                }
            });

            if (_.indexOf(self.types, removedType) === -1) {
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
    var directory = new Directory(contactsData);
    var directoryView = new DirectoryView({directory:directory});
    var contactsRouter = new ContactsRouter({directoryView:directoryView});

    Backbone.history.start();

});