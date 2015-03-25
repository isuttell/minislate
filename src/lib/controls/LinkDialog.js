var Class = require('../class');
var Dialog = require('./Dialog');
var rangy = require('rangy');

var LinkDialog = Class(Dialog, {
    show: function(node) {
        var control = this.control,
            editor = this.toolbar.editor,
            selection = rangy.saveSelection();

        editor.showDialog(function() {
            input.focus();
        });

        var input = this.addTextField('URL: ', {
            escape: function() {
                editor.restoreSelection(selection);
            },
            enter: function(evt) {
                editor.restoreSelection(selection);
                control.saveLink(node, evt.target.value);
            }
        });

        this.addButton('Save', {
            fontAwesomeID: 'check',
            click: function(evt) {
                evt.stopImmediatePropagation();
                editor.restoreSelection(selection);
                control.saveLink(node, input.value);
            }
        });

        if (node) {
            input.value = node.getAttribute('href');
            this.addButton('Remove', {
                fontAwesomeID: 'chain-broken',
                click: function(evt) {
                    evt.stopImmediatePropagation();
                    editor.restoreSelection(selection);
                    control.saveLink(node, null);
                }
            });
        }
    }
});

module.exports = LinkDialog;
