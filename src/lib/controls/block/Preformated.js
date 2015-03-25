var Block = require('./block');
var _ = require('../../util');
var extend = require('../../extend');
var Class = require('../../class');

// Preformated text
var Preformated = Class(Block, {
    tagList: ['pre'],
    tag: 'pre',
    defaults: extend({}, Block.prototype.defaults, {
        label: '<>',
        title: 'Code',
        fontAwesomeID: 'code',
        tabReplacement: '    '
    }),

    init: function() {
        Block.prototype.init.apply(this, arguments);
        var self = this,
            editor = this.toolbar.editor;

        editor.on('keydown', function(evt) {
            if (evt.which === 9 && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey) {
                // Activate tab in preformated blocks
                if (editor.filterTopNodeNames('pre').length > 0) {
                    evt.preventDefault();
                    editor.exec('insertHtml', self.options.tabReplacement);
                }
            }
        });
    },
    click: function() {
        // Replace <br> nodes by new line after formating (another webkit BS)
        Block.prototype.click.call(this);
        var editor = this.toolbar.editor,
            node = editor.getEnclosingNode(),
            nodeList = [].slice.call(node.getElementsByTagName('br'));

        _.each(nodeList, function(n) {
            n.parentNode.insertBefore(document.createTextNode('\n'), n);
            n.parentNode.removeChild(n);
        });
    }
});

module.exports = Preformated;
