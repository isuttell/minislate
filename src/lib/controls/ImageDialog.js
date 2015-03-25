/* jshint newcap:false */
/* global exports, require */

var rangy = require('rangy');
var Class = require('../class');
var Dialog = require('./Dialog');


var ImageDialog = Class(Dialog, {
    show: function(node) {
        var control = this.control;
        var editor = this.toolbar.editor;
        var selection = rangy.saveSelection();

        editor.showDialog(function() {
            input.focus();
        });

        var input = this.addTextField('URL: ', {
            escape: function() {
                editor.restoreSelection(selection);
            },
            enter: function(evt) {
                editor.restoreSelection(selection);
                control.saveImage(node, evt.target.value);
            }
        });

        this.addButton('Save', {
            fontAwesomeID: 'check',
            click: function(evt) {
                evt.stopImmediatePropagation();
                editor.restoreSelection(selection);
                control.saveImage(node, input.value);
            }
        });

        if (node) {
            input.value = node.getAttribute('src');
        }
    }
});

module.exports = ImageDialog;
