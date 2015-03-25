/**
 * Button
 */

var BaseControl = require('./BaseControl');
var Class = require('../Class');

var Button = Class(BaseControl, {
    classes: ['button'],

    init: function(toolbar, id, options) {
        BaseControl.prototype.init.call(this, toolbar, id, options);

        var self = this;
        this.element.addEventListener('click', function(evt) {
            self.click(evt);
        });
    },

    _getParentElement: function() {
        var e = BaseControl.prototype._getParentElement.call(this);
        e.classList.add(this.toolbar._getClassName('button'));
        return e;
    },

    _initElement: function() {
        return document.createElement('button');
    },

    drawElement: function() {
        var e = document.createElement('li');
        e.classList.add(this.toolbar._getClassName('button'));
        return BaseControl.prototype.drawElement.call(this, e);
    },

    click: function() {
    }
});

module.exports = Button;
