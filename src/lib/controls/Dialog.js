/**
 * Dialog
 */

var Class = require('../class');
var extend = require('../extend');
var BaseControl = require('./BaseControl');

var Dialog = Class(Object, {
    init: function(control) {
        this.control = control;
        this.toolbar = control.toolbar;
        this.element = control.toolbar.dialog;
    },

    addTextField: function(label, options) {
        var defaults = {
            size: 30,
            enter: null,
            escape: null
        };
        options = extend({}, defaults, options || {});

        var input = document.createElement('input');
        var _label = document.createElement('label');
        _label.appendChild(document.createTextNode(label));
        input.setAttribute('size', options.size);
        input.setAttribute('type', 'text');
        _label.appendChild(input);
        this.element.appendChild(_label);

        if (options.enter || options.escape) {
            input.addEventListener('keyup', function(evt) {
                if (options.escape && evt.which === 27) {
                    options.escape.call(input, evt);
                }
                else if (options.enter && evt.which === 13) {
                    options.enter.call(input, evt);
                }
            });
        }

        return input;
    },

    addButton: function(label, options) {
        var defaults = {
            click: null,
            fontAwesomeID: null
        };
        options = extend({}, defaults, options || {});

        var button = document.createElement('button');
        button.appendChild(document.createTextNode(label));
        this.element.appendChild(document.createTextNode(' '));
        this.element.appendChild(button);
        this.element.appendChild(document.createTextNode(' '));

        if (options.click && typeof(options.click) === 'function') {
            button.addEventListener('click', options.click);
        }

        if (options.fontAwesomeID && this.toolbar.options.fontAwesomeEnabled) {
            button.removeChild(button.firstChild);
            button.setAttribute('title', label);
            var el = BaseControl.prototype.getFaElement.call(this, options.fontAwesomeID);
            button.appendChild(el);
        }

        return button;
    }
});

module.exports = Dialog;
