import Ember from 'ember';
export default Ember.Handlebars.makeBoundHelper(function(object, path){
    return Ember.get(object, path);
});
