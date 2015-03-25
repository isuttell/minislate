var Class = require('../../class');
var extend = require('../../extend');
var _ = require('../../util');
var Button = require('../Button');

// Base block (paragraph)
var Block = Class(Button, {
    tagList: [],
    tag: null,
    command: 'formatblock',
    defaults: extend({}, Button.prototype.defaults),

    init: function() {
        Button.prototype.init.apply(this, arguments);
        this.BLOCK_NODES = _.filter(this.toolbar.editor.BLOCK_NODES, function(v) {
            return ['ul', 'ol'].indexOf(v.toLowerCase()) === -1;
        });
    },

    isHighlighted: function() {
        return this.toolbar.editor.filterTopNodeNames.apply(
            this.toolbar.editor, this.tagList
        ).length > 0;
    },

    click: function() {
        var editor = this.toolbar.editor,
            topNodes;

        if (this.command === 'formatblock') {
            // Expand selection before formating to avoid some issues with webkit
            if (!this.isHighlighted()) {
                topNodes = editor.filterTopNodeNames.apply(editor, this.BLOCK_NODES);
                if (topNodes.length > 0) {
                    editor.setRange(topNodes[0]);
                }
            }
            this.toolbar.editor.exec(this.command, '<' + this.tag + '>');
        } else {
            this.toolbar.editor.exec(this.command);
        }
        this.toolbar.editor.showToolbar();
    }
});
module.exports = Block;
