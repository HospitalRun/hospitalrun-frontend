import Ember from 'ember';
var supportsSetterGetter;

try {
  Ember.computed({
    set: function() { },
    get: function() { }
  });
  supportsSetterGetter = true;
} catch(e) {
  supportsSetterGetter = false;
}

export default supportsSetterGetter;
