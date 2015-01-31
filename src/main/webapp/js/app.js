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
    var BASE_URL = 'http://localhost:8080/backbone-example/app/Contacts';

    // model
    var Contact = Backbone.Model.extend({
        defaults: {
            photo: "img/placeholder.png",
            name: "",
            address: "",
            tel: "",
            email: "",
            type: ""
        },
        urlRoot: BASE_URL
    });

    // collection
    var Directory = Backbone.Collection.extend({
        model: Contact,
        url: BASE_URL
    });

    // individual model view
    var ContactView = Backbone.View.extend({
        tagName: "article",
        className: "contact-container",
        template: $("#contactTemplate").html(),
        editTemplate: _.template($("#contactEditTemplate").html()),

        // TODO : need to make the 'Type' field for addNewContact to work the same as it does in the editTemplate (dropdown+edit)
        
        initialize: function(options){
//            AbstractView.prototype.initialize.apply(self, arguments);
            this.selectOfTypes = options.selectOfTypes;
        },

        render: function () {
            var tmpl = _.template(this.template);

            this.$el.html(tmpl(this.model.toJSON()));
            return this; // enable chai`ning
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
            // TODO : if you have multiple records in their Edit view, and you click save ( with a new type ), then it will be re-rendered, and your changes will be lost; one solution would be to only allow no more than 1 Contact to be in an Edit mode at a time.
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
            var theModel = this.model;
            var theForm = $(event.target).closest("form");

            _.each(Object.keys(theModel.attributes), function(attr, index){
                var newVal = theForm.find("."+attr).val();
                if ( undefined !== newVal ){
                    formData[attr] = newVal;
                }
            });

            if (formData.photo === "") {
                delete formData.photo;
            }

            this.model.set(formData);
            var prev = this.model.previousAttributes();
            this.model.save();
            this.render();

            if (prev.photo === Contact.prototype.defaults['photo']) {
                delete prev.photo;
            }

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
        addNewContactInputs: $("#addContact").children("input"),
        childViews: [],
        types: [],

        initialize: function (options) {
            this.listenTo(this.collection, "reset", this.collectionResetDataHandler);
            this.listenTo(this.collection, "add", this.collectionAddDataHandler);
            this.listenTo(this.collection, "remove", this.collectionRemoveDataHandler);
        },

        collectionResetDataHandler: function(e){
            this.render(e);
        },

        collectionAddDataHandler: function(addedModel){
            var self = this;
            self.$el.append(self.renderContact(addedModel));

            var typeLower = addedModel.get('type').toLowerCase();
            if (self.types.length !== 0 && _.indexOf(self.types, typeLower) === -1) {
                self.types.push(typeLower);
                forms.createOption(typeLower).appendTo(self.contactTypeSelect)
                self.render(); // for each viewable ContactView, add typeLower to it's select as well or re-render them.
            }
        },

        collectionRemoveDataHandler: function(removedModel){
            var self = this;

            var removed = removedModel.attributes;
            if (removed.photo !== Contact.prototype.defaults['photo']) {
                delete removed.photo;
            }
        },

        render: function () {
            var self = this;
            self.renderContactTypeSelect();

            return this;
        },

        renderContactTypeSelect: function(){
            var self = this;
            var currentFilterType = self.contactTypeSelect.val();

            $.getJSON(BASE_URL+"/types")
                .done(function(json){
                    self.types = json;

                    if ( null === currentFilterType ){
                        var options = forms.createOptions(self.types, ["<option value='all'>All</option>"]);
                        self.contactTypeSelect.find('option').remove().end().append(options);
                        self.contactTypeSelect.val('all');
                    } else if ( self.contactTypeSelect.val() !== currentFilterType) {
                        self.contactTypeSelect.val(currentFilterType);
                    }

                    self.renderContacts();
                });

        },

        renderContacts: function(){
            var self = this;

            self.$el.find("article").remove();
            _.each(self.childViews, function(childView){
                childView.remove();
            });
            self.childViews = [];

            var selectOfTypes = forms.createSelectOfItems(self.types);
            var container = document.createDocumentFragment();
            _.each(self.collection.models, function (item) {
                container.appendChild(self.renderContact(item, selectOfTypes));
            }, this);
            self.$el.append(container);
        },

        renderContact: function (contactModel, selectOfTypes) {
            var self = this;

            var contactView = new ContactView({
                model: contactModel,
                selectOfTypes: selectOfTypes
            });
            self.childViews.push(contactView);
            return contactView.render().el;
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
         * resets collection, changes router state, and ensures that we have the correct state within the select
         *
         * Honestly, this function feels more like Controller logic.
         *
         */
        filterByType: function (filterType) {
            var self = this;
            contactsRouter.navigate("filter/" + filterType);
            this.collection.fetch({data:{filterType:filterType}})
                .done(function(){
                    self.render();
                });

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
            self.addNewContactInputs.each(function (i, el) {
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });

            var newContact = new Contact(formData);
            newContact.save().done(
                function(data){
                    self.collection.add(newContact);
                }
            );
            // TODO: what if you add a Contact with a different 'type' than what's filtered [eg: self.contactTypeSelect.val()] ... should you show it?
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
    var directoryView = new DirectoryView({collection:new Directory()});
    var contactsRouter = new ContactsRouter({directoryView:directoryView});

    Backbone.history.start();

});