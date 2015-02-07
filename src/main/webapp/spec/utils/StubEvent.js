define(function (require) {

    'use strict';

    var _ = require('underscore');
    var $ = require('jquery');

    function StubEvent(options) {
        var self = this;
        _.extend(self, options);
        options = options || {};
        self.target = options.target;
        self.currentTarget = options.currentTarget;
    }

    var prototype = StubEvent.prototype;
    var target = undefined;
    var preventDefaultWasCalled = false;
    var currentTarget = undefined;

    prototype.preventDefault = function(){
        var self = this;
        self.preventDefaultWasCalled = true;
        return false;
    };

    prototype.wasPreventDefaultWasCalled = function(){
        var self = this;
        return self.preventDefaultWasCalled;
    };

    return StubEvent;
});