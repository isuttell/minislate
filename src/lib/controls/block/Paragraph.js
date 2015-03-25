var Class = require('../../class');
var extend = require('../../extend');
var Block = require('./Block');

var Paragraph = Class(Block, {
    tagList: ['p'],
    tag: 'p',
    command: 'formatblock',
    defaults: extend({}, Block.prototype.defaults, {
        label: '¶',
        title: 'Paragraph'
    })
});

module.exports = Paragraph;
