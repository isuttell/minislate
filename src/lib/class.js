var extend = require('./extend');

// A very simple class implementation
var Class  = function Class(parent, proto) {
    var C = function() {
        if (typeof(this.init) !== 'undefined') {
            this.init.apply(this, arguments);
        }
    };
    var F = function() {};

    F.prototype = parent.prototype;
    C.prototype = new F();
    C.prototype.constructor = parent;
    extend(C.prototype, proto);

    return C;
};

module.exports = Class;
