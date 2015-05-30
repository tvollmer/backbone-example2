define(function(require){

    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Contact = require('model/Contact');
    var ContactView = require('view/ContactView');
    var FormUtils = require('utils/Forms');
    var formHtml = require('text!template/addContactFormTemplate.html');
    var props = JSON.parse(require('text!props'));

    var forms = new FormUtils();

    var BASE_URL = 'http://localhost:8080/backbone-example/app/Contacts';

    var DirectoryView = Backbone.View.extend({
//        el: '#container', // set by app.js, but not jasmine
        template: require('text!template/directoryViewTemplate.html'),
        childViews: [],
        types: [],
        ALL_OPTION : '<option value="all">All</option>',

        initialize: function (options) {
            this.listenTo(this.collection, 'reset', this.collectionResetDataHandler);
            this.listenTo(this.collection, 'add', this.collectionAddDataHandler);
            this.listenTo(this.collection, 'remove', this.collectionRemoveDataHandler);
        },

        collectionResetDataHandler: function(e){
            this.render();
        },

        collectionAddDataHandler: function(addedModel){
            var self = this;
            var contactsDiv = self.$('#contacts');
            var contactTypeSelect = self.$('#filterType');
            contactsDiv.append(self.renderContact(addedModel));

            var typeLower = addedModel.get('type').toLowerCase();
            if (self.types.length !== 0 && _.indexOf(self.types, typeLower) === -1) {
                self.types.push(typeLower);
                forms.createOption(typeLower).appendTo(contactTypeSelect);
                self.filterType = contactTypeSelect.val();
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
            self.$el.html(tmpl(props));
            self.renderContactTypeSelect();
            self.renderContacts();
            self.$('#addContactFormWrapper').append(formHtml);
            return this;
        },

        renderContactTypeSelect: function(){
            var self = this;
            var contactTypeSelect = self.$('#filterType');
            var currentFilterType = self.filterType || contactTypeSelect.val();

            if ( self.types.length === 0 ) {
                self.collection.getAllTypes(function(json){
                        self.types = json;
                        self.renderContactTypeSelectOptions(self.types, [self.ALL_OPTION]);
                        contactTypeSelect.val(currentFilterType);
                        self.filterType = undefined;
                    });
            } else {
                if ( contactTypeSelect.find('option').length === 0 ){
                    self.renderContactTypeSelectOptions(self.types, [self.ALL_OPTION]);
                }
                contactTypeSelect.val(currentFilterType);
                self.filterType = undefined;
            }
        },

        renderContactTypeSelectOptions: function(items, initialOptionsArray){
            var self = this;

            var contactTypeSelect = self.$('#filterType');
            var contactTypeSelectOptions = contactTypeSelect.find('option');

            var options = forms.createOptions(items, initialOptionsArray);
            contactTypeSelectOptions.remove().end().append(options);
        },

        renderContacts: function(){
            var self = this;
            var contactsDiv = self.$('#contacts');

            contactsDiv.find('article').remove();
            _.each(self.childViews, function(childView){
                childView.remove();
            });
            self.childViews = [];

            var selectOfTypes = forms.createSelectOfItems(self.types);
            var container = document.createDocumentFragment();
            _.each(self.collection.models, function (item) {
                container.appendChild(self.renderContact(item, selectOfTypes));
            }, this);

            contactsDiv.find('#articles').append(container);
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
            'click #add': 'addContactButtonClickHandler',
            'click #showForm': 'showFormClickUIHandler',
            'change #filterType': 'filterTypeChangeUIHandler'
        },

        filterTypeChangeUIHandler: function(e){
            var self = this;
            var filterType = e.currentTarget.value;
            self.filterByType(filterType);
            self.formIsVisible = false;
        },

        /**
         * resets collection, changes router state, and ensures that we have the correct state within the select
         *
         * Honestly, this function feels more like Controller logic.
         *
         */
        filterByType: function (filterType) {
            var self = this;
            self.router.navigate('filter/' + filterType); // should the view be able to call the router directly?
            self.filterType = filterType;
            self.collection.fetch({data:{filterType:filterType}})
                .done(function(){
                    self.render();
                });
        },

        addContactButtonClickHandler: function (e) {
            e.preventDefault();
            var self = this;
            var addNewContactInputs = self.$('#addContact').children('input');

            var formData = {};
            addNewContactInputs.each(function (i, elem) {
                var element = $(elem);
                if (element.val() !== '') {
                    formData[elem.id] = element.val();
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
            var addContactForm = self.$('#addContact');
            if ( !self.formIsVisible ){
                addContactForm.slideToggle(function(){
                    self.formIsVisible = true;
                });
            }
        }
    });

    return DirectoryView;
});
