/* global require, exports */
exports.VERSION = '{{version}}';

// Rangy and extensions
exports.rangy = require('rangy');
require('rangy/lib/rangy-classapplier');
require('rangy/lib/rangy-serializer');
require('rangy/lib/rangy-selectionsaverestore');
require('rangy/lib/rangy-textrange');
require('./lib/rangy-extensions');

// Utils
exports.extend = require('./lib/extend');
exports.Class = require('./lib/class');
exports.HtmlCleaner = require('./lib/html-cleaner');

// Editor
exports.Editor = require('./lib/editor');
exports.controls = require('./lib/controls');
exports.simpleEditor = require('./lib/simpleEditor');
