import Ember from 'ember';
export default Ember.Handlebars.makeBoundHelper(function(lhs, rhs) {
    if (!Ember.isArray(lhs) || !Ember.isArray(rhs) || lhs.get('length') !== rhs.get('length')) {
        return false;
    }
    return lhs.every(function(item) {        
        return rhs.contains(item);
    });
});
