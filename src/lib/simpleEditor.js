/**
 * simpleEditor
 */

var Class = require('./class');
var Editor = require('./editor');
var controls = require('./controls');

var simpleEditor = Class(Editor, {
    init: function() {
        Editor.prototype.init.apply(this, arguments);

        if(this.options.controls.blocks) {
            this.toolbar.addControl(controls.Menu, 'blocks', {
                label: '¶',
                title: 'Blocks',
                controls: [
                    [controls.block.Paragraph, 'p'],
                    [controls.block.H1, 'h1'],
                    [controls.block.H2, 'h2'],
                    [controls.block.H3, 'h3'],
                    [controls.block.Preformated, 'pre']
                ]
            });
        }
        if(this.options.controls.lists) {
            this.toolbar.addControl(controls.Menu, 'lists', {
                label: 'Lists',
                title: 'Lists',
                fontAwesomeID: 'list-ul',
                controls: [
                    [controls.block.UnorderedList, 'ul'],
                    [controls.block.OrderedList, 'ol']
                ]
            });
        }
        if(this.options.controls.quote) {
            this.toolbar.addControl(controls.block.Blockquote, 'quote');
        }
        if(this.options.controls.bold) {
            this.toolbar.addControl(controls.inline.Bold, 'bold');
        }
        if(this.options.controls.italic) {
            this.toolbar.addControl(controls.inline.Italic, 'italic');
        }
        if(this.options.controls.underline) {
            this.toolbar.addControl(controls.inline.Underline, 'underline');
        }
        if(this.options.controls.strike) {
            this.toolbar.addControl(controls.inline.StrikeThrough, 'strike');
        }
        if(this.options.controls.link) {
            this.toolbar.addControl(controls.inline.Link, 'link');
        }
        if(this.options.controls.image) {
            this.toolbar.addControl(controls.media.Image, 'image');
        }
        if(this.options.controls.oembed) {
            this.toolbar.addControl(controls.media.Oembed, 'oembed');
        }
    }
});

module.exports = simpleEditor;
