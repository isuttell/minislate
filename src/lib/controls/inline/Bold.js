var Class = require('../../class');
var extend = require('../../extend');
var Inline = require('./Inline');

var Bold = Class(Inline, {
    defaults: extend({}, Inline.prototype.defaults, {
        label: 'B',
        title: 'Bold',
        fontAwesomeID: 'bold'
    }),
    tagList: ['b', 'strong'],
    command: 'bold',

    init: function() {
        Inline.prototype.init.apply(this, arguments);

        // Allow bold with Cmd+b or Ctrl+b
        var self = this,
            editor = this.toolbar.editor;

        editor.on('keydown', function(evt) {
            if (evt.which === 66 && (evt.ctrlKey || evt.metaKey)) {
                evt.preventDefault();
                self.click();
            }
        });
    }
});

module.exports = Bold;
