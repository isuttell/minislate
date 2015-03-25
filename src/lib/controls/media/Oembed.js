/* jshint newcap:false */
/* global exports, require */

var Class = require('../../class');
var extend = require('../../extend');
var Button = require('../Button');

var Oembed = Class(Button, {
    defaults: extend({}, Button.prototype.defaults, {
        label: 'Embeded',
        title: 'Embeded content',
        fontAwesomeID: 'youtube-play'
    }),

    click: function() {
        window.alert('No implemented yet :)');
    }
});

module.exports = Oembed;
