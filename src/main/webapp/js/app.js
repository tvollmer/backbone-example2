(function ($) {

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
            photo: "img/placeholder.png"
        }
    });

    // collection
    var Directory = Backbone.Collection.extend({
        model: Contact
    });

    // individual model view
    var ContactView = Backbone.View.extend({
        tagName: "article",
        className: "contact-container",
        template: $("#contactTemplate").html(),

        render: function () {
            var tmpl = _.template(this.template);

            this.$el.html(tmpl(this.model.toJSON()));
            return this; // enable chaining
        }
    });

    /**
     * master view; this view is self-initializing [ initialize calls this.render() ]
     *
     */
    var DirectoryView = Backbone.View.extend({
        el: $("#contacts"), // set el once, and then you can get it a cached jquery reference with this.$el
        contactTypeSelect: null,

        initialize: function () {
            this.collection = new Directory(contacts);
//            this.render(); // don't need this anymore, the router/framework will invoke the render method

            contactTypeSelect = this.createSelect();
            this.$el.find("#filter").append(contactTypeSelect);

            this.on("change:filterType", this.filterByType, this); // arbitrary change event for an undefined 'this.filterType' variable
            this.collection.on("reset", this.render, this);        // bind the render method to the collection.onReset event
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
            var contactView = new ContactView({
                model: item
            });
            this.$el.append(contactView.render().el);
        },

        getTypes: function () {
            return _.uniq(this.collection.pluck("type"));
        },

        createSelect: function () {
            var select = $("<select/>", {
                    html: "<option value='all'>All</option>"
                });

            _.each(this.getTypes(), function (item) {
                var option = $("<option/>", {
                    value: item,
                    text: item
                }).appendTo(select);
            });
            return select;
        },

        events: {
            "change #filter select": "setFilter" // select onChange event
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
                    return filterType === item.type;
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
        }

    });

    var ContactsRouter = Backbone.Router.extend({
        routes: {
            "": 'defaultRoute',
            "filter/:type": "urlFilter",
            "*path": 'defaultRoute'
        },

        urlFilter: function (type) {
            directory.filterType = type;
            directory.trigger("change:filterType");
        },

        /**
         * define a default route; this helps to create a place holder for Backbone's history / using the back-button
         */
        defaultRoute : function(path){
            this.urlFilter('all');
        }
    });

    // create an instance of the master view [ let's get this party started!!! ]
    var directory = new DirectoryView();
    var contactsRouter = new ContactsRouter();

    Backbone.history.start();

} (jQuery));