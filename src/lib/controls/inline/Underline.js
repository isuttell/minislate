var Class = require('../../class');
var extend = require('../../extend');
var Inline = require('./Inline');

var Underline = Class(Inline, {
    defaults: extend({}, Inline.prototype.defaults, {
        label: 'U',
        title: 'Underline',
        fontAwesomeID: 'underline'
    }),
    tagList: ['u', 'ins'],
    command: 'underline'
});

module.exports = Underline;
