exports.create = function(parent) {

    var JClass = function() {
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }
    };

    if (parent) {
        var subclass = function() {};

        subclass.prototype = parent.prototype;
        JClass.prototype = new subclass;
        JClass.prototype._supper = parent.prototype;
    }

    JClass.fn = JClass.prototype;
    JClass.fn.constructor = JClass;

    return JClass;
};