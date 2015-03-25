// Simple extend system
var extend = function extend() {
    var args = Array.prototype.slice.call(arguments);
    var base = args.shift();
    var type = '';
    if (typeof base === 'string' || typeof base === 'boolean') {
        type = (base === true)?'deep':base;
        base = args.shift();
        if (type === 'defaults') {
            base = extend({}, base); //clone defaults into new object
            type = 'strict';
        }
    }
    for (var i = 0, c = args.length; i < c; i++) {
        var prop = args[i];
        for (var name in prop) {
            if (type === 'deep' && typeof prop[name] === 'object' && typeof base[name] !== 'undefined') {
                extend(type, base[name], prop[name]);
            }
            else if (type !== 'strict' || (type === 'strict' && typeof base[name] !== 'undefined')) {
                base[name] = prop[name];
            }
        }
    }
    return base;
};

module.exports = extend;
