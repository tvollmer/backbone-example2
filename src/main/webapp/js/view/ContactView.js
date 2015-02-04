define(function(require){

    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Contact = require('model/Contact');
    var FormUtils = require('utils/Forms');

    var forms = new FormUtils();


    var ContactView = Backbone.View.extend({
        tagName: 'article',
        className: 'contact-container',
        template: require('text!template/contactTemplate.html'),
        editTemplate: _.template(require('text!template/contactEditTemplate.html')),

        // TODO : need to make the 'Type' field for addNewContact to work the same as it does in the editTemplate (dropdown+edit)

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
            'click button.delete': 'deleteContactClickHandler',
            'click button.edit': 'editContactClickHandler',
            'click button.save': 'saveEditsClickHandler',
            'click button.cancel': 'cancelEditClickHandler',
            'change select.type': 'typeChangeUIHandler'
        },

        deleteContactClickHandler: function (event) {
            this.model.destroy();
            this.remove();
        },

        editContactClickHandler: function (event) {
            // TODO : if you have multiple records in their Edit view, and you click save ( with a new type ), then it will be re-rendered, and your changes will be lost; one solution would be to only allow no more than 1 Contact to be in an Edit mode at a time.
            this.$el.html(this.editTemplate(this.model.toJSON()));

            var nameElem = this.$el.find('.name');
            var typeElem = this.$el.find('#type');
            var selectedTypeVal = typeElem.val().toLowerCase();
            typeElem.remove();

            var newOpt = forms.createOption('addType', '<em>Add new...</em>');
            this.cachedRefOfTypeSelect = this.selectOfTypes.clone().addClass('type')
                .val(selectedTypeVal).append(newOpt)
                .insertAfter(nameElem);
        },

        saveEditsClickHandler: function (event) {
            event.preventDefault();
            // TODO : make a way to save a contact's image?
            var formData = {};
            var theModel = this.model;
            var theForm = $(event.target).closest('form');

            _.each(Object.keys(theModel.attributes), function(attr, index){
                var newVal = theForm.find('.'+attr).val();
                if ( undefined !== newVal ){
                    formData[attr] = newVal;
                }
            });

            if (formData.photo === '') {
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

        typeChangeUIHandler: function(event){
            if (this.cachedRefOfTypeSelect.val() === 'addType') {
                this.cachedRefOfTypeSelect.remove();

                $('<input />', {
                    'class': 'type'
                }).insertAfter(this.$el.find('.name')).focus();
            }
        }
    });

    return ContactView;
});