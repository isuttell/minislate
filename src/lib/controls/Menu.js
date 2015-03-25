var BaseControl = require('./BaseControl');
var ControlsMixin = require('./ControlsMixin');
var extend = require('../extend');
var Class = require('../class');

var Menu = Class(BaseControl, {
    defaults: extend({}, BaseControl.prototype.defaults, {
        controls: []
    }),
    classes: ['button'],
    closeDelay: 400,

    init: function(toolbar, id, options) {
        ControlsMixin.prototype.init.call(this);
        BaseControl.prototype.init.call(this, toolbar, id, options);

        // Add predefined controls
        var _klass, _id, _options;
        for (var i=0; i<this.options.controls.length; i++) {
            _klass = this.options.controls[i][0];
            _id = this.options.controls[i][1];
            _options = this.options.controls[i][2];

            this.addControl(_klass, _id, _options);
        }

        this.container = document.createElement('ul');
        this.container.classList.add(this.toolbar._getClassName('controls'));
        this.container.style.display = 'none';

        // Open/Close handlers
        // There are added on toolbar show to avoid mouseover events when toolbar is moving
        var self = this;
        var openHandler = function() {
            self._open();
        };
        var closeHandler = function() {
            self._closetimer();
        };
        var cancelHandler = function() {
            self._canceltimer();
        };

        this.toolbar.element.addEventListener('toolbar.show', function() {
            self._close();
            self.element.removeEventListener('mouseover', openHandler);
            self.element.removeEventListener('mouseout', closeHandler);
            self.container.removeEventListener('mouseover', cancelHandler);
            self.container.removeEventListener('mouseout', closeHandler);

            setTimeout(function() {
                self.element.addEventListener('mouseover', openHandler);
                self.element.addEventListener('mouseout', closeHandler);
                self.container.addEventListener('mouseover', cancelHandler);
                self.container.addEventListener('mouseout', closeHandler);
            }, 200);
        });
    },

    _open: function() {
        var control, i;

        // Close all other menus
        for (i in this.toolbar.controls) {
            control = this.toolbar.controls[i];
            if (control instanceof Menu) {
                control._canceltimer();
                control._close();
            }
        }
        this._canceltimer();
        this.container.style.display = 'block';
    },
    _close: function() {
        this.container.style.display = 'none';
    },
    _closetimer: function() {
        var self = this;
        this.closeTimeout = setTimeout(function() {
            self._close();
        }, this.closeDelay);
    },
    _canceltimer: function() {
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = null;
        }
    },

    _initElement: function() {
        return document.createElement('button');
    },

    isHighlighted: function() {
        var control, id;
        for (id in this.controls) {
            // Stop on first highlighted menu item and set its label to menu.
            control = this.controls[id];
            if (control.id, control.isHighlighted()) {
                this.setLabel(control.label, control.options.fontAwesomeID);
                return true;
            }
        }
        return false;
    },

    drawElement: function() {
        var e = document.createElement('li');
        e.classList.add(this.toolbar._getClassName('menu'));
        e = BaseControl.prototype.drawElement.call(this, e);

        // Add menu container
        e.appendChild(this.container);
        this.drawControls();
        return e;
    },

    setLabel: function(label, fontAwesomeID) {
        BaseControl.prototype.setLabel.call(this, label, fontAwesomeID);
        this.element.appendChild(document.createTextNode(' '));
        var e;
        if (this.toolbar.options.fontAwesomeEnabled) {
            e = this.getFaElement('chevron-down');
        } else {
            e = document.createElement('span');
            e.classList.add(this.toolbar._getClassName('menu-arrow'));
            e.appendChild(document.createTextNode('\u2193'));
        }
        this.element.appendChild(e);
    },

    addControl: function(Klass, id, options) {
        this.controls[id] = new Klass(this.toolbar, id, options);
        this.toolbar._dirty = true;
    },

    removeControl: function(id) {
        if (!this.controls[id]) {
            return;
        }

        ControlsMixin.prototype.removeControl.call(this, id);
        this.toolbar._dirty = true;
    },

    drawControls: function() {
        var control, id, e;

        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        for (id in this.controls) {
            control = this.controls[id];
            e = control.drawElement();
            control.setLabel();
            this.container.appendChild(e);

            if (control.options.title) {
                var el = document.createElement('em');
                var text = document.createTextNode(' - ' + control.options.title);
                el.appendChild(text);
                e.firstChild.appendChild(el);
            }
        }
    }
});

module.exports = Menu;
