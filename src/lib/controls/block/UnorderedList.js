var Class = require('../../class');
var extend = require('../../extend');
var BaseList = require('./BaseList');

var UnorderedList = Class(BaseList, {
    tagList: ['ul'],
    tag: 'ul',
    command: 'insertunorderedlist',
    defaults: extend({}, BaseList.prototype.defaults, {
        label: 'UL',
        title: 'Unordered list',
        fontAwesomeID: 'list-ul'
    })
});

module.exports = UnorderedList;
