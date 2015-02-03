define(function(require){

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var Contact = require("model/Contact");
    var ContactView = require("view/ContactView");
    var FormUtils = require("utils/Forms");
    var formHtml = require("text!template/addContactFormTemplate.html");

    var forms = new FormUtils();

    var BASE_URL = 'http://localhost:8080/backbone-example/app/Contacts';

    var DirectoryView = Backbone.View.extend({
//        el: "#container", // set by app.js, but not jasmine
        template: require("text!template/directoryViewTemplate.html"),
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
            var contactsDiv = $("#contacts");
            var contactTypeSelect = $("#filterType");
            contactsDiv.append(self.renderContact(addedModel));

            var typeLower = addedModel.get('type').toLowerCase();
            if (self.types.length !== 0 && _.indexOf(self.types, typeLower) === -1) {
                self.types.push(typeLower);
                forms.createOption(typeLower).appendTo(contactTypeSelect)
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
            var tmpl = _.template(self.template);
            self.$el.html(tmpl({}));
            self.renderContactTypeSelect();
            self.$el.find("#addContactFormWrapper").append(formHtml);
            return this;
        },

        renderContactTypeSelect: function(){
            var self = this;
            var contactTypeSelect = self.$el.find("#filterType");
            var currentFilterType = self.filterType || contactTypeSelect.val();

            if ( self.types.length === 0 ) {
                $.getJSON(BASE_URL+"/types")
                    .done(function(json){
                        self.types = json;
                        var options = forms.createOptions(self.types, ["<option value='all'>All</option>"]);
                        contactTypeSelect.find('option').remove().end().append(options);
                        contactTypeSelect.val(currentFilterType);
                        self.filterType = undefined;
                        self.renderContacts();
                    });
            } else {
                if ( contactTypeSelect.find("option").length === 0 ){
                    var options = forms.createOptions(self.types, ["<option value='all'>All</option>"]);
                    contactTypeSelect.find('option').remove().end().append(options);
                }
                contactTypeSelect.val(currentFilterType);
                self.filterType = undefined;
                self.renderContacts();
            }

        },

        renderContacts: function(){
            var self = this;
            var contactsDiv = $("#contacts");

            contactsDiv.find("article").remove();
            _.each(self.childViews, function(childView){
                childView.remove();
            });
            self.childViews = [];

            var selectOfTypes = forms.createSelectOfItems(self.types);
            var container = document.createDocumentFragment();
            _.each(self.collection.models, function (item) {
                container.appendChild(self.renderContact(item, selectOfTypes));
            }, this);
            contactsDiv.append(container);
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
            self.router.navigate("filter/" + filterType); // should the view be able to call the router directly?
            self.filterType = filterType;
            self.collection.fetch({data:{filterType:filterType}})
                .done(function(){
                    self.render();
                });
        },

        addContactButtonClickHandler: function (e) {
            e.preventDefault();
            var self = this;
            var addNewContactInputs = $("#addContact").children("input");

            var formData = {};
            addNewContactInputs.each(function (i, el) {
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
            var addContactForm = $("#addContact");
            if ( !self.formIsVisible ){
                addContactForm.slideToggle(function(){
                    self.formIsVisible = true;
                });
            }
        }
    });

    return DirectoryView;
});