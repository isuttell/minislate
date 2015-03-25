var Block = require('./Block');
var extend = require('../../extend');
var Class = require('../../class');

// Titles (H1 -> H6)
for (var i=1; i<=6; i++) {
    var C = Class(Block, {
        tagList: ['h' + i],
        tag: 'h' + i,
        defaults: extend({}, Block.prototype.defaults, {
            label: 'H' + i,
            title: 'Title level ' + i
        })
    });
    exports['H' + i] = C;
}
