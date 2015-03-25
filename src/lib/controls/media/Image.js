/* jshint newcap:false */
/* global exports, require */

var Class = require('../../class');
var extend = require('../../extend');
var Button = require('../Button');
var ImageDialog = require('../ImageDialog');

var Image = Class(Button, {
    defaults: extend({}, Button.prototype.defaults, {
        label: 'IMG',
        title: 'Image',
        fontAwesomeID: 'picture-o'
    }),

    init: function() {
        Button.prototype.init.apply(this, arguments);

        // Select image when clicked
        var editor = this.toolbar.editor;
        editor.on('click', function(evt) {
            if (evt.target.tagName.toLowerCase() === 'img') {
                editor.setRange(evt.target);
                editor.showToolbar();
            }
        });
    },

    isHighlighted: function() {
        return this.toolbar.editor.filterTopNodeNames('img').length > 0;
    },

    click: function() {
        var editor = this.toolbar.editor,
            node = editor.filterTopNodeNames('img');

        node = node.length === 0 ? null : node[0];
        (new ImageDialog(this)).show(node);
    },

    saveImage: function(node, url) {
        var editor = this.toolbar.editor,
            range = editor.getRange();

        if (node && url) {
            node.setAttribute('src', url);
            editor.setRange(node);
        } else if (url) {
            node = document.createElement('img');
            node.setAttribute('src', url);
            range.deleteContents();
            range.insertNode(node);
            editor.cleanBlock(node.parentNode);
            editor.setRange(node);
        }
        editor.showToolbar();
        return node;
    }
});

module.exports = Image;
