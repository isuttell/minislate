/**
 * ControlsMixin
 */

var Class = require('../class');

var ControlsMixin =  Class(Object, {
    init: function() {
        this.controls = {};
    },
    addControl: function(klass, id, options) {
        throw new Error('Not implemented');
    },
    removeControl: function(id) {
        if (!this.controls[id]) {
            return;
        }
        delete(this.controls[id]);
    }
});

module.exports = ControlsMixin;
