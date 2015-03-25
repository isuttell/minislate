var Class = require('../../class');
var extend = require('../../extend');
var Inline = require('./Inline');

var Italic = Class(Inline, {
    defaults: extend({}, Inline.prototype.defaults, {
        label: 'I',
        title: 'Italic',
        fontAwesomeID: 'italic'
    }),
    tagList: ['i', 'em'],
    command: 'italic',

    init: function() {
        Inline.prototype.init.apply(this, arguments);

        // Allow italic with Cmd+i or Ctrl+i
        var self = this,
            editor = this.toolbar.editor;

        editor.on('keydown', function(evt) {
            if (evt.which === 73 && (evt.ctrlKey || evt.metaKey)) {
                evt.preventDefault();
                self.click();
            }
        });
    }
});

module.exports = Italic;
