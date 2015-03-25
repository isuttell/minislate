var rangy = require('rangy');
var Block = require('./Block');
var _ = require('../../util');
var Class = require('../../class');

// Lists
var BaseList = Class(Block, {
    init: function() {
        Block.prototype.init.apply(this, arguments);
        var self = this,
            editor = this.toolbar.editor;

        editor.on('keydown', function(evt) {
            if (evt.which === 9 && !evt.ctrlKey && !evt.metaKey) {
                var topNodes = editor.filterTopNodeNames('ul', 'ol');
                if (topNodes.length === 0 || topNodes[0].nodeName.toLowerCase() !== self.tag) {
                    return;
                }

                evt.preventDefault();
                if (evt.shiftKey) {
                    editor.exec('outdent');
                } else {
                    editor.exec('indent');
                }
            }
        });
    },
    click: function() {
        var editor = this.toolbar.editor,
            topListNodes = editor.filterTopNodeNames('ul', 'ol');

        if (topListNodes.length > 0) {
            if (topListNodes[0].nodeName.toLowerCase() === this.tag) {
                return;
            }

            // Changing list type
            var node = topListNodes[0],
                selection = rangy.saveSelection(),
                e = document.createElement(this.tag);

            node.parentNode.insertBefore(e, node);
            _.each([].slice.call(node.childNodes), function(n) {
                e.appendChild(n);
            });
            node.parentNode.removeChild(node);
            rangy.restoreSelection(selection);
            rangy.removeMarkers(selection);
            editor.showToolbar();
        } else {
            // Insert a list
            Block.prototype.click.call(this);
        }
    }
});

module.exports = BaseList;
