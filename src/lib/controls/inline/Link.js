var Class = require('../../Class');
var extend = require('../../extend');
var LinkDialog = require('../LinkDialog');
var Button = require('../Button');
var _ = require('../../util');

var Link = Class(Button, {
    defaults: extend({}, Button.prototype.defaults, {
        label: '#',
        base_title: 'Link',
        title: '',
        fontAwesomeID: 'link'
    }),

    init: function() {
        Button.prototype.init.apply(this, arguments);
        var self = this,
            editor = this.toolbar.editor;

        editor.on('keydown', function(evt) {
            // Call link action with Cmd+Shift+k or Ctrl+Shift+k
            if (evt.which === 75 && evt.shiftKey && (evt.ctrlKey || evt.metaKey)) {
                evt.preventDefault();
                self.click();
            }
        });
    },

    isHighlighted: function() {
        var title = this.options.base_title;
        var nodes = this.toolbar.editor.filterTopNodeNames('a');
        if (nodes.length > 0) {
            title += ': ' + nodes[0].href;
        }
        this.element.setAttribute('title', title);
        return nodes.length > 0;
    },
    isVisible: function() {
        return !this.toolbar.editor.getSelection().isCollapsed || this.isHighlighted();
    },

    click: function() {
        var editor = this.toolbar.editor,
            collapsed = editor.getSelection().isCollapsed;

        var node = editor.filterTopNodeNames('a');
        if (collapsed && node.length === 0) {
            return;
        }

        node = node.length === 0 ? null : node[0];
        if (collapsed) {
            editor.setRange(node);
        }

        (new LinkDialog(this)).show(node);
    },

    saveLink: function(node, url) {
        var editor = this.toolbar.editor,
            range = editor.getRange();

        if (node) {
            if (!url) { //  Remove link
                var selection = rangy.saveSelection();
                rangy.dom.replaceNodeByContents(node, true);
                rangy.restoreSelection(selection);
                rangy.removeMarkers(selection);
            } else {  // Update link
                node.setAttribute('href', url);
                editor.setRange(node);
            }
        } else if (url) { //  New link
            node = document.createElement('a');
            node.setAttribute('href', url);
            node.setAttribute('target', '_blank');
            var contents = range.cloneContents();
            _.each(contents.childNodes, function(n) {
                node.appendChild(n.cloneNode(true));
            });

            range.deleteContents();
            range.insertNode(node);
            editor.setRange(node);
        }
        editor.showToolbar();
        return node;
    }
});

module.exports = Link;
