var Class = require('../../class');
var Button = require('../Button');

var Inline = Class(Button, {
    tagList: [],
    command: null,

    isHighlighted: function() {
        return this.toolbar.editor.filterTopNodeNames.apply(
            this.toolbar.editor, this.tagList
        ).length > 0;
    },
    isVisible: function() {
        return !this.toolbar.editor.getSelection().isCollapsed || this.isHighlighted();
    },

    click: function() {
        var editor = this.toolbar.editor;

        if (editor.getSelection().isCollapsed) {
            var node = editor.filterTopNodeNames.apply(editor, this.tagList);
            if (node.length === 0) {
                return;
            }
            node = node[0];
            editor.setRange(node);
        }

        editor.exec(this.command);
        editor.showToolbar();
    }
});
module.exports = Inline;
