var rangy = require('rangy');
var Block = require('./Block');
var extend = require('../../extend');
var Class = require('../../class');
var _ = require('../../util');

// Blockquotes
var Blockquote = Class(Block, {
    tagList: ['blockquote'],
    defaults: extend({}, Block.prototype.defaults, {
        label: 'Quote',
        title: 'Quote',
        fontAwesomeID: 'quote-right'
    }),

    init: function() {
        Block.prototype.init.apply(this, arguments);
        var self = this,
            editor = this.toolbar.editor;

        // Leave blockquote after an empty paragraph
        editor.on('keyup', function(evt) {
            if (evt.which === 13 && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey) {
                var node = editor.filterTopNodeNames('blockquote');
                if (node.length === 0 || !editor.getSelection().isCollapsed) {
                    return;
                }

                var parent = node[0];
                node = editor.filterTopNodeNames('p');
                if (node.length === 0) {
                    return;
                }

                node = node[0];
                if(node.previousSibling && node.previousSibling.textContent === '') {
                    node.previousSibling.parentNode.removeChild(node.previousSibling);
                    parent.parentNode.insertBefore(node, parent.nextSibling);
                    editor.setRange(node);
                    editor.getSelection().collapse(node);
                }
            }
        });

        // Indent / unindent blockquote
        editor.on('keydown', function(evt) {
            if (evt.which === 9 && !evt.ctrlKey && !evt.metaKey) {
                var node = editor.filterTopNodeNames('blockquote');
                if (node.length === 0) {
                    return;
                }

                evt.preventDefault();
                if (evt.shiftKey) {
                    self.removeBlockquote();
                } else {
                    self.insertBlockquote();
                }
            }
        });
    },

    click: function() {
        var editor = this.toolbar.editor,
            selection = editor.getSelection();

        if (selection.isCollapsed && editor.getTopNodes().length === 0) {
            return;
        }

        if (editor.filterTopNodeNames('blockquote').length > 0) {
            // Remove blockquote
            this.removeBlockquote();
        } else {
            // Insert blockquote
            this.insertBlockquote();
        }
        editor.showToolbar();
    },

    insertBlockquote: function() {
        var editor = this.toolbar.editor,
            nodeList = editor.filterTopNodeNames.apply(editor, editor.BLOCK_NODES),
            node = nodeList.length > 0 ? nodeList[0] : null,
            surroundingBlocks = editor.getSurroundingNodes(function(n) {
                return editor.BLOCK_NODES.indexOf(n.nodeName.toUpperCase()) !== -1;
            });

        if (surroundingBlocks.length > 0) {
            nodeList = surroundingBlocks;
        } else if (node) {
            nodeList = [node];
        } else {
            nodeList = editor.getSurroundingNodes();
        }

        // Expand selection to top nodes
        editor.setRange(nodeList[0], nodeList[nodeList.length - 1]);
        nodeList = editor.getSurroundingNodes();

        // Push nodes to blockquote
        var e = document.createElement('blockquote');
        nodeList[0].parentNode.insertBefore(e, nodeList[0]);
        _.each(nodeList, e.appendChild, e);

        // Set new range
        editor.setRange(e);
    },

    removeBlockquote: function() {
        var nodeList = this.toolbar.editor.filterTopNodeNames('blockquote'),
            selection = rangy.saveSelection();

        rangy.dom.replaceNodeByContents(nodeList[0]);
        rangy.restoreSelection(selection);
        rangy.removeMarkers(selection);
    }
});

module.exports = Blockquote;
