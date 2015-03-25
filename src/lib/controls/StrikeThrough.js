var Class = require('../class');
var extend = require('../extend');
var Inline = require('./inline').Inline;

var StrikeThrough = exports.StrikeThrough = Class(Inline, {
    defaults: extend({}, Inline.prototype.defaults, {
        label: 'S',
        title: 'Strike-Through',
        fontAwesomeID: 'strikethrough'
    }),
    tagList: ['strike', 'del'],
    command: 'strikeThrough'
});

module.exports = StrikeThrough;
