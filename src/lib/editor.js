/* jshint newcap:false */
/* global require, exports */
var rangy = require('rangy');
var extend = require('./extend');
var Class = require('./class');
var Toolbar = require('./toolbar');
var _ = require('./util');
var HtmlCleaner = require('./html-cleaner');

/*
 * Editor (main)
 */
var Editor = Class(Object, {
    defaults: {
        delay: 300,
        diffLeft: 2,
        diffTop: -10,
        classPrefix: 'editor-',
        fontAwesomeEnabled: true,
        faClass: 'fa',
        pasteAsText: true,
        controls: {
            'blocks': true,
            'lists': true,
            'quote': true,
            'bold': true,
            'italic': true,
            'underline': true,
            'strike': true,
            'link': true,
            'image': true,
            'oembed' : false // Not implemented
        }
    },
    BLOCK_NODES: 'P H1 H2 H3 H4 H5 H6 UL OL PRE DL DIV NOSCRIPT BLOCKQUOTE FORM HR TABLE FIELDSET ADDRESS'.split(' '),

    init: function(element, options) {
        if (!window.getSelection) {
            throw new Error('Browser features missing.');
        }

        if (typeof element !== 'object') {
            return;
        }
        this.element = element;

        if (!rangy.initialized) {
            rangy.init();
        }

        this.isActive = true;
        this.isSelected = false;
        this.options = extend(true, {}, this.defaults, options);

        // Internal properties
        this._currentEditor = null;

        // Window resizing handler
        this._resizeHandler = (function(self) {
            var timeout = null;
            return function() {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    self.setToolbarPosition();
                }, 250);
            };
        })(this);

        // Init editor
        this.initElement()
            .initToolbar()
            .bindSelect()
            .bindTyping()
            .bindPaste();
    },

    on: function(name, handler) {
        this.element.addEventListener(name, handler);
    },

    off: function(name, handler) {
        this.element.removeEventListener(name, handler);
    },

    initElement: function() {
        var self = this;
        this.element.setAttribute('contentEditable', true);
        this.element.setAttribute('data-editor-element', true);

        this.on('focus', function() {
            self._onFocus();
        });

        return this;
    },

    bindSelect: function() {
        var self = this,
            timeout = null;

        this.selectWrapper = function(evt) {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                self._onSelect(evt);
            }, self.options.delay);
        };

        document.addEventListener('mouseup', this.selectWrapper);
        document.addEventListener('keyup', this.selectWrapper);

        return this;
    },

    bindTyping: function() {
        var self = this;

        this.on('keyup', function(evt) {
            var selection = self.getSelection();
            if (evt.which !== 9 && selection.isCollapsed && selection.getEnclosingNode() === self._currentEditor) {
                self.exec('formatBlock', 'p');
            }
        });

        return this;
    },

    /**
     * Remove any styles from a paste event
     * @param     {Event}    event
     */
    pasteEvent: function(event) {
        // cancel paste
        event.preventDefault();

        // get text representation of clipboard
        var text = event.clipboardData.getData("text/plain");

        // insert text manually
        document.execCommand('insertHTML', false, text);
    },

    /**
     * Bind the paste event to the element
     */
    bindPaste: function() {
        if(this.options.pasteAsText === false) { return; }

        this.element.addEventListener('paste', this.pasteEvent);
    },

    initToolbar: function() {
        var self = this;

        // Create Toolbar
        this.toolbar = new Toolbar(this, extend({}, this.options));

        // Restore focus on editor element when showing toolbar
        this.toolbar.element.addEventListener('toolbar.show', function() {
            self.focus();
        });

        // Remove all residual markers when hidding toolbar
        this.toolbar.element.addEventListener('toolbar.hide', function() {
            var elements = self.element.querySelectorAll('span.rangySelectionBoundary');
            _.each(elements, function(e) {
                e.parentNode.removeChild(e);
            });
        });

        return this;
    },

    exec: function(cmd, arg) {
        document.execCommand(cmd, false, arg);
    },

    focus: function() {
        if (this._currentEditor) {
            this._currentEditor.focus();
        }
    },

    showToolbar: function() {
        this.toolbar.hideDialog();
        this.toolbar.show();
        this.setToolbarPosition();
        window.addEventListener('resize', this._resizeHandler);
        return this;
    },

    hideToolbar: function() {
        window.removeEventListener('resize', this._resizeHandler);
        this.toolbar.hide();
        return this;
    },

    showDialog: function(callback) {
        var self = this;
        this.toolbar.showDialog();

        setTimeout(function() {
            self.setToolbarPosition();
            if (typeof(callback) === 'function') {
                callback.call(self);
            }
        }, 20);

        return this;
    },

    setToolbarPosition: function() {
        var selection = this.getSelection(),
            range = this.getRange(),
            node = selection.getEnclosingNode(),
            height = this.toolbar.element.offsetHeight,
            width = this.toolbar.element.offsetWidth,
            boundary;

        if (!selection.isCollapsed && rangy.util.isHostMethod(range.nativeRange, 'getBoundingClientRect')) {
            // If getBoundingClientRect is enabled on selection
            boundary = range.nativeRange.getBoundingClientRect();
        } else {
            // Otherwise or when selection is collapsed, use the top enclosing node as boundary node
            while (node.parentNode.childNodes.length === 1) {
                node = node.parentNode;
            }
            boundary = node.getBoundingClientRect();
        }

        // Top position
        var top = 0;
        if (boundary.top < height) {
            top = boundary.bottom - this.options.diffTop + window.pageYOffset;
        } else {
            top = boundary.top + this.options.diffTop + window.pageYOffset - height;
        }

        // Left position
        var left = boundary.left - this.options.diffLeft;
        if (this._currentEditor.offsetWidth < width + boundary.left) {
            left = boundary.right - width + this.options.diffLeft;
        }

        this.toolbar.move(top, left);
    },

    restoreSelection: function(selection, showToolbar) {
        showToolbar = typeof(showToolbar) === 'undefined' ? true : showToolbar;

        rangy.restoreSelection(selection);
        rangy.removeMarkers(selection);
        this.element.focus();
        if (showToolbar) {
            this.showToolbar();
        }
    },

    _onFocus: function() {
        this._currentEditor = this.element;
    },

    _onSelect: function(evt) {
        var elements = [this.element, this.toolbar.element];

        if (!rangy.dom.hasParents(evt.target, elements)) {
            if (this.isSelected) {
                this.hideToolbar();
                this._currentEditor = null;
                this.isSelected = false;
            }
            return;
        }

        this._currentEditor = this.element;
        if (!rangy.dom.hasParents(evt.target, [this.toolbar.element])) {
            this.showToolbar();
        }

        if (!this.isSelected) {
            this.isSelected = true;

            // Adjust selection when entering editor with tab key
            if (evt.which === 9) {
                this.selectStart();
            }
        }
    },

    selectStart: function() {
        var selection = this.getSelection();
        if (!selection.isCollapsed) {
            return;
        }

        if (this.element.childNodes.length > 0 && this.element.firstChild.nodeType === 3) {
            if (this.element.firstChild.textContent.replace(/^\s*(.*?)\s*$/, '$1') === '') {
                this.element.removeChild(this.element.firstChild);
            }
        }

        var node, nodes;
        if (this.element.childNodes.length > 0) {
            node = this.element.firstChild;
            nodes = rangy.dom.getNodes(node, 3);
            if (nodes.length > 0) {
                node = nodes[0];
            }
        } else {
            node = document.createElement('p');
            this.element.appendChild(node);
            node.appendChild(document.createTextNode(''));
            node = node.firstChild;
        }

        if (node.nodeType === 3) {
            var range = rangy.createRange();
            range.setStart(node, 0);
            this.getSelection().setSingleRange(range);
        } else {
            this.setRange(node);
        }
        this.showToolbar();
    },

    // Selected nodes utils.
    getSelection: function() {
        return rangy.getSelection();
    },

    getRange: function(index) {
        index = typeof(index) === 'undefined' ? 0 : index;
        return this.getSelection().getRangeAt(0);
    },

    setRange: function(node, end) {
        if (typeof(node) === 'undefined') {
            return;
        }

        var range = rangy.createRange();
        range.selectNodeContents(node);

        if (end && end !== node) {
            if (end.lastChild) {
                range.setEndAfter(end.lastChild);
            } else {
                range.setEndAfter(end);
            }
        }
        this.getSelection().setSingleRange(range);
    },

    getEnclosingNode: function() {
        var selection = this.getSelection();
        if (selection.rangeCount !== 1) {
            return null;
        }
        var node = selection.getEnclosingNode();
        if (node === this._currentEditor) {
            return null;
        }
        return node;
    },

    getTopNodes: function(filter) {
        var selection = this.getSelection();
        if (selection.rangeCount !== 1) {
            return [];
        }
        return selection.getTopNodes(this._currentEditor, filter);
    },

    getSurroundingNodes: function(filter) {
        var selection = this.getSelection();
        if (selection.rangeCount !== 1) {
            return [];
        }

        return selection.getSurroundingNodes(filter);
    },

    filterTopNodeNames: function() {
        var names = _.map(arguments, function(v) {
            return v.toLowerCase();
        });
        return this.getTopNodes(function(n) {
            return names.indexOf(n.nodeName.toLowerCase()) !== -1;
        });
    },

    // Cleanup operations
    cleanBlock: function(node) {
        // remove <br> at the end of block
        var e = node.childNodes[node.childNodes.length - 1];
        if (e.nodeType === 1 && e.nodeName.toLowerCase() === 'br') {
            node.removeChild(e);
        }
    },

    serialize: function(clean) {
        var html = this.element.innerHTML;
        if (clean) {
            var cleaner = new HtmlCleaner();
            html = cleaner.clean(html);
        }
        return html;
    },

    /**
     * Clean up and destroy all the things
     */
    destroy: function() {
        this.isActive = false;
        this.hideToolbar();
        this.element.setAttribute('contentEditable', false);
        this.element.setAttribute('data-editor-element', false);
        this.element.removeEventListener('paste', this.pasteEvent);
        document.removeEventListener('mouseup', this.selectWrapper);
        document.removeEventListener('keyup', this.selectWrapper);

    }
});

module.exports = Editor;
