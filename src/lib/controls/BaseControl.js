/**
 * BaseControl
 */
var extend = require('../extend');
var Class = require('../class');

var BaseControl = Class(Object, {
    defaults: {
        label: null,
        title: '',
        classes: '',
        fontAwesomeID: null
    },
    classes: [],

    init: function(toolbar, id, options) {
        this.options = extend({}, this.defaults, options || {});
        this.toolbar = toolbar;
        this.id = id;
        this.label = this.options.label || this.id;

        this.element = this._initElement();
        this.setLabel();
        this.element.setAttribute('title', this.options.title);

        if (this.options.classes) {
            this.classes.push.apply(this.classes, this.options.classes.split(/\s+/));
        }

        for (var i=0; i<this.classes.length; i++) {
            this.element.classList.add(this.toolbar._getClassName(this.classes[i]));
        }

        var self = this;

        this.toolbar.element.addEventListener('toolbar.show', function() {
            self.setVisibility();
            self.setHighlight();
        });
    },

    _initElement: function() {
        throw new Error('_initElement not implemented');
    },

    drawElement: function(e) {
        e = e || document.createElement('li');
        e.appendChild(this.element);
        return e;
    },

    setLabel: function(label, fontAwesomeID) {
        label = label || this.label;
        fontAwesomeID = fontAwesomeID || this.options.fontAwesomeID;

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        var text = document.createTextNode(label);
        if (this.toolbar.options.fontAwesomeEnabled && fontAwesomeID) {
            var fa = this.getFaElement(fontAwesomeID);
            var span = document.createElement('span');
            span.appendChild(text);
            fa.appendChild(span);
            this.element.appendChild(fa);
        } else {
            this.element.appendChild(text);
        }
    },

    isHighlighted: function() {
        return false;
    },
    isVisible: function() {
        return true;
    },

    setVisibility: function(state) {
        state = typeof(state) !== 'undefined' ? state : this.isVisible();
        if (state) {
            this.element.parentNode.style.display = 'block';
        } else {
            this.element.parentNode.style.display = 'none';
        }
    },
    setHighlight: function(state) {
        state = typeof(state) !== 'undefined' ? state : this.isHighlighted();
        var cls = this.toolbar._getClassName('highlight');
        if (state) {
            if (!this.element.classList.contains(cls)) {
                this.element.classList.add(cls);
            }
        } else {
            this.element.classList.remove(cls);
        }
    },

    getFaElement: function(id) {
        var el = document.createElement('i');
        el.classList.add(this.toolbar.options.faClass, this.toolbar.options.faClass + '-' + id);
        return el;
    }
});

module.exports = BaseControl;
