(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(['ember'], function(Ember) { return factory(Ember); });
    } else if(typeof exports === 'object') {
        factory(require('ember'));
    } else {
        factory(Ember);
    }
})(this, function(Ember) {

