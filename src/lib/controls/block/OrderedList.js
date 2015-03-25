var Class = require('../../class');
var extend = require('../../extend');
var BaseList = require('./BaseList');

var OrderedList = Class(BaseList, {
    tagList: ['ol'],
    tag: 'ol',
    command: 'insertorderedlist',
    defaults: extend({}, BaseList.prototype.defaults, {
        label: 'OL',
        title: 'Ordered list',
        fontAwesomeID: 'list-ol'
    })
});

module.exports = OrderedList;
